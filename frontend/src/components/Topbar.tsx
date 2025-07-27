import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-black
      backdrop-blur-md z-0
    '
		>
			<Link to={'/'} className='flex items-center gap-4'><div className='flex gap-2 items-center'>
				<img src='/spotify.png' className='size-8' alt='Spotify logo' />
				Spotify
			</div></Link>

			<div >
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}
			</div>
		</div>
	);
};
export default Topbar;
