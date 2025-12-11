#include "MD4CParser.hpp"
#include "../md4c/md4c.h"

#include <stack>
#include <cstring>

namespace NitroMarkdown {

class MD4CParser::Impl {
public:
    std::shared_ptr<MarkdownNode> root;
    std::stack<std::shared_ptr<MarkdownNode>> nodeStack;
    std::string currentText;
    const char* inputText = nullptr;
    
    void reset() {
        root = std::make_shared<MarkdownNode>(NodeType::Document);
        while (!nodeStack.empty()) nodeStack.pop();
        nodeStack.push(root);
        currentText.clear();
    }
    
    void flushText() {
        if (!currentText.empty() && !nodeStack.empty()) {
            auto textNode = std::make_shared<MarkdownNode>(NodeType::Text);
            textNode->content = currentText;
            nodeStack.top()->addChild(textNode);
            currentText.clear();
        }
    }
    
    void pushNode(std::shared_ptr<MarkdownNode> node) {
        flushText();
        if (node && !nodeStack.empty()) {
            nodeStack.top()->addChild(node);
        }
        if (node) {
            nodeStack.push(node);
        }
    }
    
    void popNode() {
        flushText();
        if (nodeStack.size() > 1) {
            nodeStack.pop();
        }
    }
    
    std::string getAttributeText(const MD_ATTRIBUTE* attr) {
        if (!attr || attr->size == 0) return "";

        std::string result;
        for (unsigned i = 0; i < attr->size; i++) {
            if (attr->substr_types[i] == MD_TEXT_NORMAL ||
                attr->substr_types[i] == MD_TEXT_ENTITY ||
                attr->substr_types[i] == MD_TEXT_NULLCHAR) {
                result.append(attr->substr_offsets[i], 
                    i + 1 < attr->size ? attr->substr_offsets[i + 1] - attr->substr_offsets[i] 
                                       : attr->size - attr->substr_offsets[i]);
            }
        }
        
        if (result.empty() && attr->text && attr->size > 0) {
            result = std::string(attr->text, attr->size);
        }
        
        return result;
    }
    
    static int enterBlock(MD_BLOCKTYPE type, void* detail, void* userdata) {
        auto* impl = static_cast<Impl*>(userdata);
        
        switch (type) {
            case MD_BLOCK_DOC:
                break;
                
            case MD_BLOCK_QUOTE: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Blockquote));
                break;
            }
                
            case MD_BLOCK_UL: {
                auto node = std::make_shared<MarkdownNode>(NodeType::List);
                node->ordered = false;
                impl->pushNode(node);
                break;
            }
                
            case MD_BLOCK_OL: {
                auto* d = static_cast<MD_BLOCK_OL_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::List);
                node->ordered = true;
                node->start = d->start;
                impl->pushNode(node);
                break;
            }
                
            case MD_BLOCK_LI: {
                auto* d = static_cast<MD_BLOCK_LI_DETAIL*>(detail);
                if (d->is_task) {
                    auto node = std::make_shared<MarkdownNode>(NodeType::TaskListItem);
                    node->checked = (d->task_mark == 'x' || d->task_mark == 'X');
                    impl->pushNode(node);
                } else {
                    impl->pushNode(std::make_shared<MarkdownNode>(NodeType::ListItem));
                }
                break;
            }
                
            case MD_BLOCK_HR: {
                impl->flushText();
                impl->nodeStack.top()->addChild(
                    std::make_shared<MarkdownNode>(NodeType::HorizontalRule));
                break;
            }
                
            case MD_BLOCK_H: {
                auto* d = static_cast<MD_BLOCK_H_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::Heading);
                node->level = d->level;
                impl->pushNode(node);
                break;
            }
                
            case MD_BLOCK_CODE: {
                auto* d = static_cast<MD_BLOCK_CODE_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::CodeBlock);
                if (d->lang.text && d->lang.size > 0) {
                    node->language = std::string(d->lang.text, d->lang.size);
                }
                impl->pushNode(node);
                break;
            }
                
            case MD_BLOCK_HTML: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::HtmlBlock));
                break;
            }
                
            case MD_BLOCK_P: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Paragraph));
                break;
            }
                
            case MD_BLOCK_TABLE: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Table));
                break;
            }
                
            case MD_BLOCK_THEAD: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::TableHead));
                break;
            }
                
            case MD_BLOCK_TBODY: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::TableBody));
                break;
            }
                
            case MD_BLOCK_TR: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::TableRow));
                break;
            }
                
            case MD_BLOCK_TH: {
                auto* d = static_cast<MD_BLOCK_TD_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::TableCell);
                node->isHeader = true;
                switch (d->align) {
                    case MD_ALIGN_LEFT: node->align = TextAlign::Left; break;
                    case MD_ALIGN_CENTER: node->align = TextAlign::Center; break;
                    case MD_ALIGN_RIGHT: node->align = TextAlign::Right; break;
                    default: node->align = TextAlign::Default; break;
                }
                impl->pushNode(node);
                break;
            }
                
            case MD_BLOCK_TD: {
                auto* d = static_cast<MD_BLOCK_TD_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::TableCell);
                node->isHeader = false;
                switch (d->align) {
                    case MD_ALIGN_LEFT: node->align = TextAlign::Left; break;
                    case MD_ALIGN_CENTER: node->align = TextAlign::Center; break;
                    case MD_ALIGN_RIGHT: node->align = TextAlign::Right; break;
                    default: node->align = TextAlign::Default; break;
                }
                impl->pushNode(node);
                break;
            }
        }
        
        return 0;
    }
    
    static int leaveBlock(MD_BLOCKTYPE type, void* detail, void* userdata) {
        (void)detail;
        auto* impl = static_cast<Impl*>(userdata);
        
        switch (type) {
            case MD_BLOCK_DOC:
            case MD_BLOCK_HR:
                break;
            default:
                impl->popNode();
                break;
        }
        
        return 0;
    }
    
    static int enterSpan(MD_SPANTYPE type, void* detail, void* userdata) {
        auto* impl = static_cast<Impl*>(userdata);
        
        switch (type) {
            case MD_SPAN_EM: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Italic));
                break;
            }
                
            case MD_SPAN_STRONG: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Bold));
                break;
            }
                
            case MD_SPAN_DEL: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Strikethrough));
                break;
            }
                
            case MD_SPAN_A: {
                auto* d = static_cast<MD_SPAN_A_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::Link);
                if (d->href.text && d->href.size > 0) {
                    node->href = std::string(d->href.text, d->href.size);
                }
                if (d->title.text && d->title.size > 0) {
                    node->title = std::string(d->title.text, d->title.size);
                }
                impl->pushNode(node);
                break;
            }
                
            case MD_SPAN_IMG: {
                auto* d = static_cast<MD_SPAN_IMG_DETAIL*>(detail);
                auto node = std::make_shared<MarkdownNode>(NodeType::Image);
                if (d->src.text && d->src.size > 0) {
                    node->href = std::string(d->src.text, d->src.size);
                }
                if (d->title.text && d->title.size > 0) {
                    node->title = std::string(d->title.text, d->title.size);
                }
                impl->pushNode(node);
                break;
            }
                
            case MD_SPAN_CODE: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::CodeInline));
                break;
            }
                
            case MD_SPAN_LATEXMATH: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::MathInline));
                break;
            }
                
            case MD_SPAN_LATEXMATH_DISPLAY: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::MathBlock));
                break;
            }
                
            case MD_SPAN_U: {
                impl->pushNode(std::make_shared<MarkdownNode>(NodeType::Italic));
                break;
            }
                
            case MD_SPAN_WIKILINK: {
                auto node = std::make_shared<MarkdownNode>(NodeType::Link);
                impl->pushNode(node);
                break;
            }
        }
        
        return 0;
    }
    
    static int leaveSpan(MD_SPANTYPE type, void* detail, void* userdata) {
        (void)detail;
        auto* impl = static_cast<Impl*>(userdata);

        if (!impl->nodeStack.empty()) {
            auto currentNode = impl->nodeStack.top();

            switch (type) {
                case MD_SPAN_CODE:
                    currentNode->content = impl->currentText;
                    impl->currentText.clear();
                    break;

                case MD_SPAN_IMG:
                    currentNode->alt = impl->currentText;
                    impl->currentText.clear();
                    break;

                default:
                    break;
            }
        }

        impl->popNode();
        return 0;
    }
    
    static int text(MD_TEXTTYPE type, const MD_CHAR* text, MD_SIZE size, void* userdata) {
        auto* impl = static_cast<Impl*>(userdata);

        if (!text || size == 0) return 0;

        switch (type) {
            case MD_TEXT_NULLCHAR:
                impl->currentText += '\0';
                break;
                
            case MD_TEXT_BR:
                impl->flushText();
                impl->nodeStack.top()->addChild(
                    std::make_shared<MarkdownNode>(NodeType::LineBreak));
                break;
                
            case MD_TEXT_SOFTBR:
                impl->flushText();
                impl->nodeStack.top()->addChild(
                    std::make_shared<MarkdownNode>(NodeType::SoftBreak));
                break;
                
            case MD_TEXT_HTML:
                impl->flushText();
                {
                    auto node = std::make_shared<MarkdownNode>(NodeType::HtmlInline);
                    node->content = std::string(text, size);
                    impl->nodeStack.top()->addChild(node);
                }
                break;
                
            case MD_TEXT_ENTITY:
                impl->currentText.append(text, size);
                break;
                
            case MD_TEXT_NORMAL:
            case MD_TEXT_CODE:
            case MD_TEXT_LATEXMATH:
            default:
                impl->currentText.append(text, size);
                break;
        }
        
        return 0;
    }
};

MD4CParser::MD4CParser() : impl_(std::make_unique<Impl>()) {}

MD4CParser::~MD4CParser() = default;

std::shared_ptr<MarkdownNode> MD4CParser::parse(const std::string& markdown, const ParserOptions& options) {
    impl_->reset();
    impl_->inputText = markdown.c_str();
    
    unsigned int flags = MD_FLAG_NOHTML;
    
    if (options.gfm) {
        flags |= MD_FLAG_TABLES;
        flags |= MD_FLAG_STRIKETHROUGH;
        flags |= MD_FLAG_TASKLISTS;
        flags |= MD_FLAG_PERMISSIVEAUTOLINKS;
    }
    
    if (options.math) {
        flags |= MD_FLAG_LATEXMATHSPANS;
    }
    
    MD_PARSER parser = {
        0,
        flags,
        &Impl::enterBlock,
        &Impl::leaveBlock,
        &Impl::enterSpan,
        &Impl::leaveSpan,
        &Impl::text,
        nullptr,
        nullptr
    };

    md_parse(markdown.c_str(), 
             static_cast<MD_SIZE>(markdown.size()), 
             &parser, 
             impl_.get());

    impl_->flushText();
    return impl_->root;
}

} // namespace NitroMarkdown

