import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const urlParams = req.nextUrl.searchParams;

    const params: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      params[key] = value.replace(/ /g, "+");
    });

    const secureHash = params["vnp_SecureHash"];

    if (!secureHash) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?code=missing_hash`,
      );
    }

    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const signData = qs.stringify(sortedParams, {
      encode: false,
    });

    const hmac = crypto.createHmac(
      "sha512",
      process.env.VNP_HASH_SECRET!,
    );

    const signed = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash !== signed) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?code=invalid_checksum`,
      );
    }

    const orderId = params["vnp_TxnRef"];
    const responseCode = params["vnp_ResponseCode"];

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?orderId=${orderId}&code=order_not_found`,
      );
    }

    const isSuccess =
      responseCode === "00" &&
      order.paymentStatus === "PAID";

    if (isSuccess) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?orderId=${orderId}&code=${responseCode}`,
    );
  } catch (error) {
    console.error("RETURN ERROR:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?code=server_error`,
    );
  }
}