"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function NavPage() {
    const searchParams = useSearchParams();
    const router = useRouter()
    const search = searchParams.get('filter')
  return (
    <div>
        <ArrowLeftIcon onClick={() => router.back()} className="h-6 w-6" />
        
        {search}</div>
  )
}
