#pragma once

#include "MarkdownTypes.hpp"
#include <string>
#include <memory>

namespace NitroMarkdown {

class MD4CParser {
public:
    MD4CParser();
    ~MD4CParser();
    std::shared_ptr<MarkdownNode> parse(const std::string& markdown, const ParserOptions& options);
    
private:
    class Impl;
    std::unique_ptr<Impl> impl_;
};

} // namespace NitroMarkdown

