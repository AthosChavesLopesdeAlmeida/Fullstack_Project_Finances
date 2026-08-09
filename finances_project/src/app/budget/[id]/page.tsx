'use client'
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import { apiFetch } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"

import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"


const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page