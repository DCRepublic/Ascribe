import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  CircularProgress,
  Chip,
} from "@heroui/react";

//Icons:
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { calcStatsDoc } from "@/app/actions/actions";
import React from "react";

export default ({ editor, slug }) => {
  if (!editor) {
    return null;
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stats, setStats] = React.useState(undefined);

  const sizeOptions = [
    { key: 1, size: 1 },
    { key: 2, size: 2 },
    { key: 3, size: 3 },
    { key: 4, size: 4 },
  ];

  async function getStats() {
    if (slug) {
      let stats = await calcStatsDoc(parseInt(slug));

      setStats(stats);
    }
  }

  return (
    <>
      <div className="ml-20">
        <div className="justify-self-center">
          <ButtonGroup>
            <Button
              color="secondary"
              variant={editor.isActive("bold") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <FormatBoldIcon></FormatBoldIcon>
            </Button>
            <Button
              color="secondary"
              variant={editor.isActive("underline") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlinedIcon></FormatUnderlinedIcon>
            </Button>
            <Button
              color="secondary"
              variant={editor.isActive("italic") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon></FormatItalicIcon>
            </Button>

            <Button
              color="secondary"
              variant={editor.isActive("strike") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              <StrikethroughSIcon></StrikethroughSIcon>
            </Button>
            <Button
              color="secondary"
              variant={editor.isActive("codeBlock") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
              <CodeIcon></CodeIcon>
            </Button>

            <Button
              color="secondary"
              variant="ghost"
              onPress={() => editor.chain().focus().unsetAllMarks().run()}
            >
              <ClearAllIcon></ClearAllIcon>
            </Button>

            <Button
              color="secondary"
              variant={editor.isActive("bulletList") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <FormatListBulletedIcon></FormatListBulletedIcon>
            </Button>
            <Button
              color="secondary"
              variant={editor.isActive("orderedList") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "is-active" : ""}
            >
              <FormatListNumberedIcon></FormatListNumberedIcon>
            </Button>
            <Button
              color="secondary"
              variant={editor.isActive("blockquote") ? "solid" : "ghost"}
              onPress={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "is-active" : ""}
            >
              <FormatQuoteIcon></FormatQuoteIcon>
            </Button>
            <Button
              color="secondary"
              variant="ghost"
              onPress={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <UndoIcon></UndoIcon>
            </Button>
            <Button
              color="secondary"
              variant="ghost"
              onPress={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <RedoIcon></RedoIcon>
            </Button>
            <Button color="secondary" variant="ghost">
              <ColorLensIcon></ColorLensIcon>
              <input
                type="color"
                onInput={(event) => {
                  const input = event.target;
                  editor.chain().focus().setColor(input.value).run();
                }}
                value={editor.getAttributes("textStyle").color}
                data-testid="setColor"
              />
            </Button>

            {/* 

            <Dropdown>
              <DropdownTrigger>
                <Button color="secondary" variant="ghost">
                  <FormatClearIcon></FormatClearIcon>
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Static Actions"
                className="text-center h-40 overflow-y-scroll "
              >
                <DropdownItem
                  key="left"
                  onPress={editor.chain().focus().setTextAlign("left").run()}
                  className={
                    editor.isActive({ textAlign: "left" }) ? "is-active" : ""
                  }
                >
                  Left
                </DropdownItem>
                <DropdownItem
                  key="center"
                  onPress={editor.chain().focus().setTextAlign("center").run()}
                  className={
                    editor.isActive({ textAlign: "center" }) ? "is-active" : ""
                  }
                >
                  Center
                </DropdownItem>
                <DropdownItem
                  key="right"
                  onPress={editor.chain().focus().setTextAlign("right").run()}
                  className={
                    editor.isActive({ textAlign: "right" }) ? "is-active" : ""
                  }
                >
                  Right
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            */}

            <Dropdown>
              <DropdownTrigger>
                <Button color="secondary" variant="bordered">
                  Size
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                className="text-center h-40 overflow-y-scroll "
              >
                {sizeOptions.map((size) => (
                  <DropdownItem
                    key={size.key}
                    color="secondary"
                    onPress={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: size.size })
                        .run()
                    }
                    className={`
                     ${
                       editor.isActive("heading", { level: size.size })
                         ? "is-active"
                         : ""
                     }`}
                    showDivider
                  >
                    {size.size}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button color="secondary" variant="bordered">
                  Font
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                className="text-center h-40 overflow-y-scroll "
              >
                <DropdownItem
                  onPress={() =>
                    editor.chain().focus().setFontFamily("Inter").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "Inter" })
                      ? "is-active"
                      : ""
                  }
                  data-test-id="inter"
                >
                  Inter
                </DropdownItem>
                <DropdownItem
                  variant={
                    editor.isActive("textStyle", {
                      fontFamily: '"Comic Sans MS", "Comic Sans"',
                    })
                      ? "solid"
                      : "ghost"
                  }
                  onPress={() =>
                    editor
                      .chain()
                      .focus()
                      .setFontFamily('"Comic Sans MS", "Comic Sans"')
                      .run()
                  }
                  className={
                    editor.isActive("textStyle", {
                      fontFamily: '"Comic Sans MS", "Comic Sans"',
                    })
                      ? "is-active"
                      : ""
                  }
                  data-test-id="comic-sans"
                >
                  Comic Sans
                </DropdownItem>
                <DropdownItem
                  variant={
                    editor.isActive("textStyle", { fontFamily: "serif" })
                      ? "solid"
                      : "ghost"
                  }
                  onPress={() =>
                    editor.chain().focus().setFontFamily("serif").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "serif" })
                      ? "is-active"
                      : ""
                  }
                  data-test-id="serif"
                >
                  Serif
                </DropdownItem>
                <DropdownItem
                  variant={
                    editor.isActive("textStyle", { fontFamily: "monospace" })
                      ? "solid"
                      : "ghost"
                  }
                  onPress={() =>
                    editor.chain().focus().setFontFamily("monospace").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "monospace" })
                      ? "is-active"
                      : ""
                  }
                  data-test-id="monospace"
                >
                  Monospace
                </DropdownItem>
                <DropdownItem
                  variant={
                    editor.isActive("textStyle", { fontFamily: "cursive" })
                      ? "solid"
                      : "ghost"
                  }
                  onPress={() =>
                    editor.chain().focus().setFontFamily("cursive").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "cursive" })
                      ? "is-active"
                      : ""
                  }
                  data-test-id="cursive"
                >
                  Cursive
                </DropdownItem>

                <DropdownItem
                  variant={
                    editor.isActive("textStyle", { fontFamily: '"Exo 2"' })
                      ? "solid"
                      : "ghost"
                  }
                  onPress={() =>
                    editor.chain().focus().setFontFamily('"Exo 2"').run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: '"Exo 2"' })
                      ? "is-active"
                      : ""
                  }
                  data-test-id="exo2"
                >
                  Exo 2
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              color="secondary"
              variant="solid"
              className=""
              onPress={() => {
                onOpen();
                getStats();
              }}
            >
              Generate Stats
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              {stats == undefined ? (
                <ModalBody className="ml-auto mr-auto">
                  <CircularProgress
                    className="justify-items-center"
                    aria-label="Loading..."
                    label="Generating Overview"
                  />
                </ModalBody>
              ) : (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-xl text-center">
                    Summary Of Note
                  </ModalHeader>
                  <ModalBody>
                    SUMMARY:
                    <div>{stats?.summary}</div>
                    <div>
                      WORDCLOUD:
                      <div className="grid grid-cols-5 gap-5 justify-items-center mt-5">
                        {stats?.cloud?.map((word) => (
                          <Chip color="primary" size="lg">
                            {word}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
