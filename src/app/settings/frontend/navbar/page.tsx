import ComponentStyleEditor from "@/components/moderator/ComponentStyleEditor";


export default function NavbarSettingsPage() {
  return (
    <>
    <div className="p-6">
      <h1 className="text-6xl font-bold">NavBar UI Settings</h1>
      <ComponentStyleEditor componentNames={["navbar", "navbar.logo", "navbar.link.parent", "navbar.link.children"]} />
    </div>
    </>
  );
}
