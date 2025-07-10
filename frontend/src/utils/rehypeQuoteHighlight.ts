import { visit } from 'unist-util-visit'
import type { Root, Element, Text, ElementContent } from 'hast'

// 따옴표 패턴
const QUOTE_PATTERN = /"([^"]+)"|'([^']+)'|"([^"]+)"|'([^']+)'|\u201C([^\u201D]+)\u201D|\u2018([^\u2019]+)\u2019/g

export default function rehypeQuoteHighlight() {
  return (tree: Root) => {
    // 코드 블록 노드들을 추적하기 위한 Set
    const codeBlockNodes = new Set<Element>()
    
    // 먼저 모든 코드 블록 노드들을 수집
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'code' || node.tagName === 'pre') {
        codeBlockNodes.add(node)
      }
    })
    
    // 텍스트 노드를 처리하되, 코드 블록 내부인지 확인
    visit(tree, 'text', (node: Text, index, parent) => {
      // 현재 노드가 코드 블록 내부에 있는지 확인하는 함수
      const isInsideCodeBlock = (parent: Element | undefined): boolean => {
        if (!parent) return false
        
        // 부모가 코드 블록이거나 코드 블록 내부에 있는지 확인
        if (codeBlockNodes.has(parent)) {
          return true
        }
        
        // 재귀적으로 조상 노드들을 확인
        // 이를 위해 모든 코드 블록 노드들을 순회하면서 현재 노드가 그 안에 있는지 확인
        for (const codeBlock of codeBlockNodes) {
          if (isDescendant(codeBlock, parent)) {
            return true
          }
        }
        
        return false
      }
      
      // 노드가 다른 노드의 후손인지 확인하는 함수
      const isDescendant = (ancestor: Element, node: Element): boolean => {
        const stack = [...ancestor.children]
        while (stack.length > 0) {
          const current = stack.pop()
          if (current === node) {
            return true
          }
          if (current && current.type === 'element') {
            stack.push(...current.children)
          }
        }
        return false
      }
      
      // 코드 블록 내부라면 처리하지 않음
      if (parent && parent.type === 'element' && isInsideCodeBlock(parent)) {
        return
      }
      
      const originalText = node.value
      
      // 새로운 정규 표현식 인스턴스를 생성
      const testRegex = new RegExp(QUOTE_PATTERN.source, 'g')
      
      // 따옴표 패턴이 있는지 확인
      if (testRegex.test(originalText)) {
        // 실제 replace를 위한 새로운 정규 표현식 인스턴스
        const replaceRegex = new RegExp(QUOTE_PATTERN.source, 'g')
        
        // 텍스트를 분할하여 처리
        const parts: ElementContent[] = []
        let lastIndex = 0
        let match
        
        while ((match = replaceRegex.exec(originalText)) !== null) {
          // 매칭 전 텍스트가 있으면 추가
          if (match.index > lastIndex) {
            const textNode: Text = {
              type: 'text',
              value: originalText.slice(lastIndex, match.index)
            }
            parts.push(textNode)
          }
          
          // 하이라이트된 부분 추가
          const highlightElement: Element = {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['quote-highlight']
            },
            children: [{
              type: 'text',
              value: match[0]
            } as Text]
          }
          parts.push(highlightElement)
          
          lastIndex = match.index + match[0].length
        }
        
        // 남은 텍스트가 있으면 추가
        if (lastIndex < originalText.length) {
          const textNode: Text = {
            type: 'text',
            value: originalText.slice(lastIndex)
          }
          parts.push(textNode)
        }
        
        // 부모 노드에서 현재 노드를 새로운 노드들로 교체
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1, ...parts)
        }
      }
    })
  }
} 