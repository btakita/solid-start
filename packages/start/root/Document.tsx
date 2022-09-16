import { children, ComponentProps } from "solid-js";
import { insert, resolveSSRNode, spread, ssrElement } from "solid-js/web";
import Links from "./Links";
import Meta from "./Meta";
import Scripts from "./Scripts";

export function Html(props: ComponentProps<"html">) {
  if (import.meta.env.MPA) {
  }
  if (import.meta.env.SSR) {
    return ssrElement('html', props, resolveSSRNode(props.children), false);
  } else {
    spread(document.documentElement, props, false, true);
    return props.children;
  }
}

export function Head(props: ComponentProps<"head">) {
  if (import.meta.env.SSR) {
    return ssrElement('head', props, resolveSSRNode(
      <>
        {props.children}
        <Meta />
        <Links />
      </>
    ), false);
  } else {
    spread(document.head, props, false, true);
    return props.children;
  }
}

export function Body(props: ComponentProps<"body">) {
  if (import.meta.env.SSR) {
    return ssrElement('body', props,
      import.meta.env.START_SSR
      ? resolveSSRNode(props.children)
      : resolveSSRNode(<Scripts/>),
      false);
  } else {
    if (import.meta.env.START_SSR) {
      let child = children(() => props.children);
      spread(document.body, props, false, true);
      insert(
        document.body,
        () => {
          let childNodes = child();
          if (childNodes) {
            if (Array.isArray(childNodes)) {
              let els = childNodes.filter(n => Boolean(n));

              if (!els.length) {
                return null;
              }

              return els;
            }
            return childNodes;
          }
          return null;
        },
        null,
        [...document.body.childNodes]
      );

      return document.body;
    } else {
      spread(document.body, props, false, true);
      return props.children;
    }
  }
}
