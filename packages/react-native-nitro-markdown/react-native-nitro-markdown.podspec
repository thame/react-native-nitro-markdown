require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-nitro-markdown"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/JoaoPauloCMarra/react-native-nitro-markdown.git", :tag => "#{s.version}" }

  # All source files including md4c and our C++ implementation
  s.source_files = [
    "ios/**/*.{h,m,mm,swift}",
    "cpp/**/*.{h,hpp,c,cpp}"
  ]

  # Ensure md4c.c is compiled as C, not C++
  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    "CLANG_CXX_LIBRARY" => "libc++",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) MD4C_USE_UTF8=1",
    "HEADER_SEARCH_PATHS" => [
      "\"$(PODS_TARGET_SRCROOT)/cpp/md4c\"",
      "\"$(PODS_TARGET_SRCROOT)/cpp/core\"",
      "\"$(PODS_TARGET_SRCROOT)/cpp/bindings\"",
      "\"$(PODS_TARGET_SRCROOT)/nitrogen/generated/shared/c++\"",
      "\"$(PODS_TARGET_SRCROOT)/nitrogen/generated/ios\""
    ].join(" ")
  }

  # React Native dependency
  s.dependency "React-Core"
  
  # Add Nitro autolinking
  load 'nitrogen/generated/ios/NitroMarkdown+autolinking.rb'
  add_nitrogen_files(s)
end
