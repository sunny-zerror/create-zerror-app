import {
  RiBehanceLine,
  RiDribbbleLine,
  RiFacebookCircleLine,
  RiGithubLine,
  RiGlobalLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiPinterestLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from "@remixicon/react";
import DevHint from "@/components/ui/DevHint";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

const NETWORKS = {
  instagram: { label: "Instagram", Icon: RiInstagramLine },
  linkedin: { label: "LinkedIn", Icon: RiLinkedinBoxLine },
  facebook: { label: "Facebook", Icon: RiFacebookCircleLine },
  x: { label: "X", Icon: RiTwitterXLine },
  youtube: { label: "YouTube", Icon: RiYoutubeLine },
  behance: { label: "Behance", Icon: RiBehanceLine },
  dribbble: { label: "Dribbble", Icon: RiDribbbleLine },
  pinterest: { label: "Pinterest", Icon: RiPinterestLine },
  github: { label: "GitHub", Icon: RiGithubLine },
};

/** Icon links for every filled-in siteConfig.socials entry */
export default function SocialLinks({ className }) {
  const links = Object.entries(siteConfig.socials).filter(([, url]) => url);
  if (!links.length) return <DevHint>socials</DevHint>;

  return (
    <ul className={cn("flex flex-wrap items-center gap-4", className)}>
      {links.map(([network, url]) => {
        const { label, Icon } = NETWORKS[network] ?? { label: network, Icon: RiGlobalLine };
        return (
          <li key={network}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteConfig.name} on ${label}`}
              className="block transition-opacity duration-300 hover:opacity-60"
            >
              <Icon size={20} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
