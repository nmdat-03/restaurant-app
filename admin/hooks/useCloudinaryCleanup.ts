import { useEffect, useRef } from "react";

export function useCloudinaryCleanup() {
  const idsRef = useRef<Set<string>>(new Set());

  const add = (id: string) => {
    idsRef.current.add(id);
  };

  const remove = (id: string) => {
    idsRef.current.delete(id);
  };

  const clear = () => {
    idsRef.current.clear();
  };

  useEffect(() => {
    return () => {
      idsRef.current.forEach((id) => {
        navigator.sendBeacon(
          "/api/cloudinary/delete",
          JSON.stringify({ publicId: id }),
        );
      });
    };
  }, []);

  return { add, remove, clear };
}
