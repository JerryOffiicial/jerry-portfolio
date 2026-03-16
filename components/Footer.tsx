import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full bg-transparent">
      <div className="mx-auto max-w-6xl px-5 md:px-8">

        {/* HR with gap on both sides */}
        <hr className="border-none h-[1px] bg-[#0D1B2A]/15 dark:bg-[#E6E9EC]/15" />

        {/* Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">

          {/* Left — copyright */}
          <p className="text-xs font-secondary text-[#0D1B2A] dark:text-[#E6E9EC] tracking-[-0.01em]">
            © {new Date().getFullYear()} Gunaseelan Jerryson. All rights reserved.
          </p>

          {/* Right — nav links */}
          <div className="flex items-center gap-6">
            {["Home", "About", "Projects", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-secondary text-[#0D1B2A] dark:text-[#E6E9EC] hover:text-[#1A73E8] dark:hover:text-[#1A73E8] transition-colors duration-200 tracking-[-0.01em]"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}