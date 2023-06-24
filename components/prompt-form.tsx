import * as React from 'react';
import Link from 'next/link';
import Textarea from 'react-textarea-autosize';
import { UseChatHelpers } from 'ai/react';

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons';

// Define an array of dropdown options with multiple values
const dropdownOptions = [
  {
    label: 'Dropdown 1',
    values: ['Value 1', 'Value 2', 'Value 3'],
  },
  {
    label: 'Dropdown 2',
    values: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  },
  {
    label: 'Dropdown 3',
    values: ['Choice A', 'Choice B', 'Choice C'],
  },
  // Add more dropdown options as needed
];

export interface PromptProps extends Pick<UseChatHelpers, 'setInput'> {
  onSubmit: (value: string, dropdownValues: string[]) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, setInput, isLoading }: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Initialize dropdown option states
  const [dropdownValues, setDropdownValues] = React.useState<string[]>(
    Array(dropdownOptions.length).fill('')
  );

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Check if all dropdown options are selected
  const isAllOptionsSelected = dropdownValues.every((value) => value !== '');

  // Generate the prompt text by combining dropdown values
  function generatePromptText(dropdownValues: string[]): string {
    const varText = `hello ${dropdownValues[0]} iam rohan ${dropdownValues[1]} and ${dropdownValues[2]}`;
    return varText;
  }

  // Generate the selected values for the dropdown buttons
  function generateSelectedValues(): string {
    const selectedValues = dropdownValues.map((value, index) => {
      const option = dropdownOptions[index];
      return value ? option.values.find((val) => val === value) : undefined;
    }).filter(Boolean);
    return generatePromptText(selectedValues as string[]);
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const text = generatePromptText(dropdownValues);
        await onSubmit(text, dropdownValues);
        setInput('');
        setDropdownValues(Array(dropdownOptions.length).fill(''));
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <div className="flex space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Render dropdown menus */}
          {dropdownOptions.map((option, index) => (
            <div key={index}>
              <label className="mr-2">{option.label}</label>
              <select
                value={dropdownValues[index]}
                onChange={(e) => setDropdownValueByIndex(index, e.target.value)}
                className="bg-white rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select an option</option>
                {option.values.map((value, valueIndex) => (
                  <option key={valueIndex} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {/* <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value=""
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        /> */}
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={!isAllOptionsSelected || isLoading}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{generateSelectedValues()}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );

  // Helper function to set the dropdown value by index
  function setDropdownValueByIndex(index: number, value: string) {
    const newDropdownValues = [...dropdownValues];
    newDropdownValues[index] = value;
    setDropdownValues(newDropdownValues);
  }
}
