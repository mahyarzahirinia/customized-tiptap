import { Component, defineAsyncComponent } from "vue";
import LoadingComponent from "../loadings/LoadingComponent.vue";

interface Props {
  component: string;
  loadPath?: string;
  loadingComponent?: Component;
}

export const useLazyLoad = ({
  component = "",
  loadPath = "../components",
  loadingComponent = LoadingComponent,
}: Props) => {
  return {
    [component.replace(/\//g, "")]: defineAsyncComponent({
      loader: () => import(`${loadPath}/${component}.vue`),
      loadingComponent,
      suspensible: false,
    }),
  };
};
