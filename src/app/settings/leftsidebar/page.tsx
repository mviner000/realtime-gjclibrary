import ComponentStyleEditor from "@/components/moderator/ComponentStyleEditor";


export default function LeftSideBarSettingsPage() {
  return (
    <>
    <div className="p-6">
    <h1 className="text-6xl font-bold">Left Side Bar UI Settings</h1>
      <ComponentStyleEditor
      componentNames={[
          "leftSideBar", 
          "leftSideBar.main.links", 
          "leftSideBar.main.parent.links", 
          "leftSideBar.main.links.icon",
          "leftSideBar.your.shortcuts.accordion",
          "leftSideBar.your.shortcuts.accordion.text",
          "leftSideBar.your.shortcuts.accordion.icon",
          "leftSideBar.shortcuts.button",
          "leftSideBar.shortcuts.button.text",
          "leftSideBar.shortcuts.button.icon",
          "leftSideBar.footer.parent",
          "leftSideBar.footer.text"
        ]} />
      </div>
    </>
  );
}
