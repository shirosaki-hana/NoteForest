<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Typography from '@tiptap/extension-typography';
  import Placeholder from '@tiptap/extension-placeholder';
  import Focus from '@tiptap/extension-focus';

  // Props
  export let content = '';
  export let placeholder = '메모를 작성해보세요...';

  // State
  let editorElement: HTMLElement;
  let editor: Editor;
  let isReady = false;

  // 에디터 초기화
  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        Typography,
        Placeholder.configure({
          placeholder: placeholder,
        }),
        Focus.configure({
          className: 'has-focus',
          mode: 'all',
        }),
      ],
      content: content || '<p></p>',
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
      },
      onTransaction: () => {
        // 에디터 상태 업데이트를 위해 Svelte 반응성 트리거
        editor = editor;
      },
      onCreate: () => {
        isReady = true;
      },
      onUpdate: ({ editor }) => {
        // 콘텐츠 변경 시 이벤트 발생 (나중에 저장 로직에 사용)
        content = editor.getHTML();
        console.log('Content updated:', content);
      },
    });
  });

  // 컴포넌트 정리
  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  // 툴바 액션 함수들
  function toggleBold() {
    editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor.chain().focus().toggleItalic().run();
  }

  function toggleStrike() {
    editor.chain().focus().toggleStrike().run();
  }

  function toggleCode() {
    editor.chain().focus().toggleCode().run();
  }
  function setHeading(level: number) {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
  }

  function toggleBulletList() {
    editor.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor.chain().focus().toggleOrderedList().run();
  }

  function toggleBlockquote() {
    editor.chain().focus().toggleBlockquote().run();
  }

  function insertHorizontalRule() {
    editor.chain().focus().setHorizontalRule().run();
  }

  function undo() {
    editor.chain().focus().undo().run();
  }

  function redo() {
    editor.chain().focus().redo().run();
  }

  // 활성 상태 체크 함수들
  $: isBold = editor?.isActive('bold') ?? false;
  $: isItalic = editor?.isActive('italic') ?? false;
  $: isStrike = editor?.isActive('strike') ?? false;
  $: isCode = editor?.isActive('code') ?? false;
  $: isBulletList = editor?.isActive('bulletList') ?? false;
  $: isOrderedList = editor?.isActive('orderedList') ?? false;
  $: isBlockquote = editor?.isActive('blockquote') ?? false;
  $: canUndo = editor?.can().undo() ?? false;
  $: canRedo = editor?.can().redo() ?? false;
</script>

<div class="editor-container">
  <!-- 툴바 -->
  <div class="toolbar">
    <div class="toolbar-group">
      <!-- 제목 레벨 -->
      <select 
        class="heading-select"
        on:change={(e) => setHeading(parseInt(e.currentTarget.value))}
        disabled={!isReady}
      >
        <option value="0">본문</option>
        <option value="1">제목 1</option>
        <option value="2">제목 2</option>
        <option value="3">제목 3</option>
        <option value="4">제목 4</option>
        <option value="5">제목 5</option>
        <option value="6">제목 6</option>
      </select>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <!-- 텍스트 포매팅 -->
      <button 
        class="toolbar-btn"
        class:active={isBold}
        on:click={toggleBold}
        disabled={!isReady}
        title="굵게 (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      
      <button 
        class="toolbar-btn"
        class:active={isItalic}
        on:click={toggleItalic}
        disabled={!isReady}
        title="기울임 (Ctrl+I)"
      >
        <em>I</em>
      </button>
      
      <button 
        class="toolbar-btn"
        class:active={isStrike}
        on:click={toggleStrike}
        disabled={!isReady}
        title="취소선"
      >
        <s>S</s>
      </button>
      
      <button 
        class="toolbar-btn"
        class:active={isCode}
        on:click={toggleCode}
        disabled={!isReady}
        title="인라인 코드"
      >
        <code>&lt;/&gt;</code>
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <!-- 리스트 -->
      <button 
        class="toolbar-btn"
        class:active={isBulletList}
        on:click={toggleBulletList}
        disabled={!isReady}
        title="불릿 리스트"
      >
        • 목록
      </button>
      
      <button 
        class="toolbar-btn"
        class:active={isOrderedList}
        on:click={toggleOrderedList}
        disabled={!isReady}
        title="순서 리스트"
      >
        1. 목록
      </button>
      
      <button 
        class="toolbar-btn"
        class:active={isBlockquote}
        on:click={toggleBlockquote}
        disabled={!isReady}
        title="인용문"
      >
        " 인용
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-group">
      <!-- 기타 -->
      <button 
        class="toolbar-btn"
        on:click={insertHorizontalRule}
        disabled={!isReady}
        title="구분선"
      >
        ──
      </button>
    </div>

    <div class="toolbar-spacer"></div>

    <div class="toolbar-group">
      <!-- 실행 취소/다시 실행 -->
      <button 
        class="toolbar-btn"
        on:click={undo}
        disabled={!isReady || !canUndo}
        title="실행 취소 (Ctrl+Z)"
      >
        ↶
      </button>
      
      <button 
        class="toolbar-btn"
        on:click={redo}
        disabled={!isReady || !canRedo}
        title="다시 실행 (Ctrl+Y)"
      >
        ↷
      </button>
    </div>
  </div>

  <!-- 에디터 -->
  <div class="editor-wrapper">
    <div bind:this={editorElement} class="editor"></div>
  </div>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(145deg, #1e1e2e, #262640);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  /* 툴바 */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-wrap: wrap;
  }

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .toolbar-separator {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 0.25rem;
  }

  .toolbar-spacer {
    flex: 1;
  }

  .heading-select {
    background: rgba(255, 255, 255, 0.05);
    color: #f0f0f0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .heading-select:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(100, 181, 246, 0.3);
  }

  .heading-select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toolbar-btn {
    background: rgba(255, 255, 255, 0.05);
    color: #a0a0b2;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    min-width: auto;
  }

  .toolbar-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
    border-color: rgba(100, 181, 246, 0.3);
  }

  .toolbar-btn.active {
    background: linear-gradient(135deg, #64b5f6, #42a5f5);
    color: white;
    border-color: #64b5f6;
  }

  .toolbar-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* 에디터 래퍼 */
  .editor-wrapper {
    flex: 1;
    overflow: auto;
    padding: 1rem;
  }

  /* 에디터 스타일 */
  :global(.editor) {
    min-height: 100%;
    color: #f0f0f0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
  }

  :global(.editor .ProseMirror) {
    outline: none;
    min-height: 100%;
    padding: 0;
  }

  /* 플레이스홀더 */
  :global(.editor .ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #7a7a8a;
    pointer-events: none;
    height: 0;
  }

  /* 마크다운 스타일링 */
  :global(.editor h1) {
    font-size: 2rem;
    font-weight: 700;
    color: #f0f0f0;
    margin: 1.5rem 0 1rem 0;
    line-height: 1.2;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
  }

  :global(.editor h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #f0f0f0;
    margin: 1.25rem 0 0.75rem 0;
    line-height: 1.3;
  }

  :global(.editor h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #f0f0f0;
    margin: 1rem 0 0.5rem 0;
    line-height: 1.4;
  }

  :global(.editor h4, .editor h5, .editor h6) {
    font-size: 1rem;
    font-weight: 600;
    color: #f0f0f0;
    margin: 0.75rem 0 0.5rem 0;
    line-height: 1.4;
  }

  :global(.editor p) {
    margin: 0.75rem 0;
    color: #e0e0e0;
  }

  :global(.editor strong) {
    font-weight: 700;
    color: #f0f0f0;
  }

  :global(.editor em) {
    font-style: italic;
    color: #f0f0f0;
  }

  :global(.editor code) {
    background: rgba(100, 181, 246, 0.1);
    color: #81c784;
    padding: 0.125rem 0.25rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875em;
  }

  :global(.editor pre) {
    background: rgba(0, 0, 0, 0.3);
    color: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #64b5f6;
    overflow-x: auto;
    margin: 1rem 0;
  }

  :global(.editor pre code) {
    background: none;
    color: inherit;
    padding: 0;
    font-size: 0.875rem;
  }

  :global(.editor blockquote) {
    border-left: 4px solid #64b5f6;
    margin: 1rem 0;
    padding: 0.5rem 0 0.5rem 1rem;
    background: rgba(100, 181, 246, 0.05);
    border-radius: 0 8px 8px 0;
  }

  :global(.editor blockquote p) {
    color: #b3b3b3;
    font-style: italic;
    margin: 0.5rem 0;
  }

  :global(.editor ul, .editor ol) {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }

  :global(.editor li) {
    margin: 0.25rem 0;
    color: #e0e0e0;
  }

  :global(.editor li p) {
    margin: 0;
  }

  :global(.editor hr) {
    border: none;
    border-top: 2px solid rgba(255, 255, 255, 0.2);
    margin: 2rem 0;
  }

  /* 포커스 스타일 */
  :global(.editor.has-focus) {
    outline: none;
  }

  /* 스크롤바 스타일링 */
  .editor-wrapper::-webkit-scrollbar {
    width: 8px;
  }

  .editor-wrapper::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .editor-wrapper::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .editor-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .toolbar {
      padding: 0.5rem;
      gap: 0.25rem;
    }

    .toolbar-btn {
      padding: 0.25rem 0.375rem;
      font-size: 0.7rem;
    }

    .heading-select {
      font-size: 0.75rem;
      padding: 0.25rem 0.375rem;
    }

    .editor-wrapper {
      padding: 0.75rem;
    }

    :global(.editor h1) {
      font-size: 1.5rem;
    }

    :global(.editor h2) {
      font-size: 1.25rem;
    }

    :global(.editor h3) {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 480px) {
    .toolbar {
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .toolbar-separator {
      display: none;
    }

    .toolbar-spacer {
      display: none;
    }
  }
</style>
