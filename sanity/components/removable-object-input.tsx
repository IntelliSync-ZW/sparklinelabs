import { useCallback } from "react";
import { unset, type ObjectInputProps } from "sanity";
import { Button, Flex, Stack } from "@sanity/ui";
import { TrashIcon } from "@sanity/icons";

/**
 * Studio input for an optional object field (a section's task or knowledge check,
 * a lesson's introduction). Adds a "Remove" button that clears just this field, so an
 * author who starts one and changes their mind doesn't have to delete the whole
 * section. Studio has no built-in way to clear a nested object.
 */
export function removableObjectInput(label: string) {
  function RemovableObjectInput(props: ObjectInputProps) {
    const { value, onChange, readOnly } = props;
    // Anything beyond Sanity's own bookkeeping keys means there is something to remove.
    const hasValue = Boolean(value && Object.keys(value).some((key) => !key.startsWith("_")));

    const remove = useCallback(() => {
      if (window.confirm(`Remove this ${label}? Everything entered in it will be cleared; nothing else changes.`)) {
        onChange(unset());
      }
    }, [onChange]);

    return (
      <Stack space={3}>
        {hasValue && !readOnly && (
          <Flex justify="flex-end">
            <Button
              mode="ghost"
              tone="critical"
              icon={TrashIcon}
              text={`Remove ${label}`}
              fontSize={1}
              padding={2}
              onClick={remove}
            />
          </Flex>
        )}
        {props.renderDefault(props)}
      </Stack>
    );
  }
  RemovableObjectInput.displayName = `RemovableObjectInput(${label})`;
  return RemovableObjectInput;
}
