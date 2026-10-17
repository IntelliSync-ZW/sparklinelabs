import type { BlockAnnotationProps } from "sanity";

/** Highlights text carrying a review comment in the Studio editor. */
export function ReviewCommentAnnotation(props: BlockAnnotationProps) {
  const comment = (props.value as { comment?: string } | undefined)?.comment;
  return (
    <span
      title={comment ? `Review comment: ${comment}` : "Review comment"}
      style={{
        backgroundColor: "rgba(250, 204, 21, 0.35)",
        borderBottom: "2px solid rgb(234, 179, 8)",
      }}
    >
      {props.renderDefault(props)}
    </span>
  );
}
