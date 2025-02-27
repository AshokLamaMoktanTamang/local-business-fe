import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useController } from "react-hook-form";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

interface RichTextEditorProps {
  name: string;
  control: any;
  defaultValue?: string;
}

export function RichTextEditor({
  name,
  control,
  defaultValue = "",
}: RichTextEditorProps) {
  const {
    field: { value, onChange },
  } = useController({ name, control, defaultValue });

  const editor = useEditor({
    extensions: [StarterKit, BulletList, OrderedList, ListItem],
    content: value || defaultValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <Card className="w-full border">
      <CardContent className="p-3 space-y-3">
        <ToggleGroup type="multiple" className="flex gap-1">
          <ToggleGroupItem
            value="bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator />

        <div className="border rounded-md min-h-[150px] p-3 bg-background">
          <EditorContent
            placeholder="Enter the description"
            className="editor"
            editor={editor}
          />
        </div>
      </CardContent>
    </Card>
  );
}
