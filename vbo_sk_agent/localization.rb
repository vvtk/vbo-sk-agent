# encoding: UTF-8
require 'json'
require 'uri'

module VBO
  module SkAgent
    module Localization
      LANGUAGES = %w[auto zh-CN en].freeze
      LOCALES_DIR = File.join(__dir__, 'locales').freeze

      def self.preference
        value = Config.get('ui_language')
        LANGUAGES.include?(value) ? value : 'auto'
      end

      def self.locale
        return preference unless preference == 'auto'
        Sketchup.get_locale.to_s.downcase.start_with?('zh') ? 'zh-CN' : 'en'
      rescue StandardError
        'en'
      end

      def self.messages(language = locale)
        @catalogs ||= {}
        @catalogs[language] ||= begin
          english = JSON.parse(File.read(File.join(LOCALES_DIR, 'en.json'), encoding: 'UTF-8'))
          translated = if language == 'en'
                         english
                       else
                         JSON.parse(File.read(File.join(LOCALES_DIR, "#{language}.json"), encoding: 'UTF-8'))
                       end
          english.merge(translated).each_with_object({}) do |(key, value), catalog|
            catalog[key.strip] = value
          end.freeze
        end
      end

      def self.t(key, values = {})
        normalized_key = key.to_s.strip
        messages.fetch(normalized_key, normalized_key).gsub(/%\{(\w+)\}/) do |token|
          values.fetch(Regexp.last_match(1).to_sym, token).to_s
        end
      end

      # SketchUp does not provide a supported menu-label setter. Keep the
      # startup language so the Dashboard can explain when a restart is needed.
      def self.capture_menu_locale
        @menu_locale ||= locale
      end

      def self.payload
        {
          preference: preference,
          locale: locale,
          messages: messages,
          menu_restart_required: !!(@menu_locale && @menu_locale != locale),
        }
      end

      def self.set_language(value)
        return false unless LANGUAGES.include?(value)
        Config.set('ui_language', value)
        refresh_commands
        true
      end

      def self.register_command(command, prefix)
        @commands ||= []
        @commands << [command, prefix]
        refresh_commands
      end

      def self.refresh_commands
        (@commands || []).each do |command, prefix|
          command.tooltip = t("#{prefix}.tooltip")
          command.status_bar_text = t("#{prefix}.status")
        end
      end

      def self.beginner_guide_path
        name = locale == 'zh-CN' ? 'beginner_guide.zh-CN.md' : 'beginner_guide.md'
        File.join(__dir__, 'templates', name)
      end
    end
  end
end
