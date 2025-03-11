import { Droplet } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md relative">
                <span className="text-2xl font-bold">Z</span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-current transform -rotate-45"></div>
                </div>
                <Droplet className="absolute top-0 right-0 size-3 text-blue-400" />
                <Droplet className="absolute bottom-0 left-0 size-3 text-blue-400" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Zupa Distributors Ltd</span>
                <span className="truncate text-xs text-muted-foreground">Beverage AFMS</span>
            </div>
        </>
    );
}