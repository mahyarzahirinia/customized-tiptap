// TypeScript declaration for import.meta.glob
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const modules = import.meta.glob("../components/*.vue", { eager: true });

const allComponents: Record<string, any> = {};
for (const path in modules) {
  // Extract the component name from the file path
  const name = path.split("/").pop()?.replace(".vue", "");
  if (!name) continue;
  allComponents[name] = (modules[path] as any).default;
}

export const useStaticLoad = ({ component = "" }: { component: string }) => {
  return {
    [component.replace(/\//g, "")]: allComponents[component],
  };
};
