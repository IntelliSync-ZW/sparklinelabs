import { Callout } from "./callout";
import { CheckpointBlock } from "./checkpoint";
import { ComparisonBlock } from "./comparison";
import { FigureBlock } from "./figure";
import { KeyTermBlock } from "./key-term";
import { PromptBlock } from "./prompt-block";
import { Prose } from "./prose";
import { ResourceBlock } from "./resource";
import { ScenarioBlock } from "./scenario";
import { StepsBlock } from "./steps";
import { TableBlock } from "./table";
import { VideoBlock } from "./video";
import type { ContentItem, PortableTextValue } from "./types";

/**
 * Renders a section's `content` array. Consecutive rich-text blocks are grouped
 * so lists and paragraphs flow together; every other type maps to its own design.
 * Unknown types render nothing rather than breaking the lesson.
 */
export function renderBlocks(items: ContentItem[]): React.ReactNode[] {
  const output: React.ReactNode[] = [];
  let text: ContentItem[] = [];

  const flushText = () => {
    if (text.length === 0) return;
    output.push(<Prose key={`text-${text[0]._key}`} value={text as unknown as PortableTextValue} />);
    text = [];
  };

  for (const item of items) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = item as any;
    switch (item._type) {
      case "block":
        text.push(item);
        continue;
      case "callout":
        flushText();
        output.push(<Callout key={item._key} value={value} />);
        break;
      case "promptBlock":
        flushText();
        output.push(<PromptBlock key={item._key} value={value} />);
        break;
      case "scenarioBlock":
        flushText();
        output.push(<ScenarioBlock key={item._key} value={value} />);
        break;
      case "comparisonBlock":
        flushText();
        output.push(<ComparisonBlock key={item._key} value={value} />);
        break;
      case "stepsBlock":
        flushText();
        output.push(<StepsBlock key={item._key} value={value} />);
        break;
      case "keyTermBlock":
        flushText();
        output.push(<KeyTermBlock key={item._key} value={value} />);
        break;
      case "checkpointBlock":
        flushText();
        output.push(<CheckpointBlock key={item._key} value={value} />);
        break;
      case "videoBlock":
        flushText();
        output.push(<VideoBlock key={item._key} value={value} />);
        break;
      case "resourceBlock":
        flushText();
        output.push(<ResourceBlock key={item._key} value={value} />);
        break;
      case "image":
        flushText();
        output.push(<FigureBlock key={item._key} value={value} />);
        break;
      case "stlTableBlock":
        flushText();
        output.push(<TableBlock key={item._key} value={value} />);
        break;
      default:
        break;
    }
  }
  flushText();
  return output;
}
