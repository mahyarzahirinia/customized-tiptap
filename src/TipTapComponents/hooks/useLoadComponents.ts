import { useLazyLoad } from "./useLazyLoad";
import { useStaticLoad } from "./useStaticLoad";

interface Props {
  components: string[];
  settings?: {
    lazyLoad?: boolean;
  };
}

export const useLoadComponents = ({
  components = [],
  settings: { lazyLoad = true } = {},
}: Props) => {
  if (components?.length === 0 || !Array.isArray(components)) return;
  let loadedComponents = [];
  // debugger;
  if (lazyLoad)
    loadedComponents = components.map((component: string) =>
      useLazyLoad({ component })
    );
  else
    loadedComponents = components.map((component: string) =>
      useStaticLoad({ component })
    );

  return Object.assign({}, ...loadedComponents);
};
