import Image from "next/image";
import { Link } from "next-view-transitions";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

/** The brand logo (public/logo.svg), linking home */
export default function Logo({ className, onClick }) {
  return (
    <Link href="/" onClick={onClick} className={cn("inline-flex shrink-0 items-center", className)}>
      <Image src={siteConfig.logo} alt={siteConfig.name} width={160} height={40} className="h-8 w-auto" unoptimized />
    </Link>
  );
}
