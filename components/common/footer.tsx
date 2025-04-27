import NavLink from "./nav-link";

export default function Footer(){
  return (
    <footer className="w-full py-6 border-t border-gray-200 mt-12">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-sm text-gray-500 px-4">
        <p>&copy; {new Date().getFullYear()} Sommaire. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <NavLink href="#privacy-policy" className="hover:underline">Privacy Policy</NavLink>
          <NavLink href="#terms" className="hover:underline">Terms</NavLink>
        </div>
      </div>
    </footer>
  );
};
