<template>
  <Button text="کاراکترهای خاص" @click="dialog = true">
    <v-icon icon="mdi-omega" />
  </Button>

  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="card-title">کاراکترهای خاص </v-card-title>
      <v-card-text>
        <v-container class="" fluid>
          <v-row>
            <v-col cols="3">
              <v-list>
                <v-list-item
                  v-for="category in categories"
                  :key="category.value"
                  :class="{
                    'bg-grey-lighten-4': selectedCategory === category.value,
                  }"
                  @click="selectCategory(category.value)"
                >
                  <v-list-item-title>{{ category.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="9">
              <div>
                <v-text-field v-model="search" dense label="جستجو" />
              </div>
              <div class="chars-container">
                <div v-for="char in filteredCharacters" :key="char.value">
                  <button class="char-btn" @click="insertCharacter(char.value)">
                    {{ char.value }}
                  </button>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button class="button" @click="dialog = false">بستن</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from "vue";
import Button from "../components/Button.vue";
import type { Editor } from "@tiptap/core";

type Character = { label: string; value: string };
type CharacterCategories =
  | "currency"
  | "text"
  | "quotations"
  | "mathematical"
  | "extendedLatin"
  | "symbols"
  | "arrows";

const dialog = ref<boolean>(false);
const search = ref<string>("");
const selectedCategory = ref<CharacterCategories>();
const props = defineProps<{ editor: Editor }>();

const categories: { label: string; value: CharacterCategories }[] = [
  { label: "واحد پولی", value: "currency" },
  { label: "متن", value: "text" },
  { label: "نقل قول", value: "quotations" },
  { label: "ریاضیات", value: "mathematical" },
  { label: "لاتین", value: "extendedLatin" },
  { label: "علائم", value: "symbols" },
  { label: "جهت ها", value: "arrows" },
];

const characters: Record<CharacterCategories, Character[]> = {
  currency: [
    { label: "dollar sign", value: "$" },
    { label: "cent sign", value: "¢" },
    { label: "euro sign", value: "€" },
    { label: "pound sign", value: "£" },
    { label: "yen sign", value: "¥" },
    { label: "currency sign", value: "¤" },
    { label: "euro currency sign", value: "₠" },
    { label: "colon sign", value: "₡" },
    { label: "cruzeiro sign", value: "₢" },
    { label: "french franc sign", value: "₣" },
    { label: "lira sign", value: "₤" },
    { label: "mill sign", value: "₥" },
    { label: "naira sign", value: "₦" },
    { label: "peseta sign", value: "₧" },
    { label: "rupee sign", value: "₨" },
    { label: "won sign", value: "₩" },
    { label: "new sheqel sign", value: "₪" },
    { label: "dong sign", value: "₫" },
    { label: "kip sign", value: "₭" },
    { label: "tugrik sign", value: "₮" },
    { label: "drachma sign", value: "₯" },
    { label: "german penny symbol", value: "₰" },
    { label: "peso sign", value: "₱" },
    { label: "guarani sign", value: "₲" },
    { label: "austral sign", value: "₳" },
    { label: "hryvnia sign", value: "₴" },
    { label: "cedi sign", value: "₵" },
    { label: "livre tournois sign", value: "₶" },
    { label: "spesmilo sign", value: "₷" },
    { label: "tenge sign", value: "₸" },
    { label: "indian rupee sign", value: "₹" },
    { label: "turkish lira sign", value: "₺" },
    { label: "nordic mark sign", value: "₻" },
    { label: "manat sign", value: "₼" },
    { label: "ruble sign", value: "₽" },
    { label: "yen character", value: "円" },
    { label: "yuan character", value: "元" },
    { label: "yuan character, in hong kong and taiwan", value: "圓" },
    { label: "yen/yuan character variant one", value: "圆" },
  ],
  text: [
    { label: "copyright sign", value: "©" },
    { label: "registered sign", value: "®" },
    { label: "trade mark sign", value: "™" },
    { label: "per mille sign", value: "‰" },
    { label: "micro sign", value: "µ" },
    { label: "middle dot", value: "·" },
    { label: "bullet", value: "•" },
    { label: "three dot leader", value: "…" },
    { label: "minutes / feet", value: "′" },
    { label: "seconds / inches", value: "″" },
    { label: "section sign", value: "§" },
    { label: "paragraph sign", value: "¶" },
    { label: "sharp s / ess zed", value: "ß" },
  ],
  quotations: [
    { label: "single left pointing angle quotation mark", value: "‹" },
    { label: "single right pointing angle quotation mark", value: "›" },
    { label: "left pointing guillemet", value: "«" },
    { label: "right pointing guillemet", value: "»" },
    { label: "left single quotation mark", value: "‘" },
    { label: "right single quotation mark", value: "’" },
    { label: "left double quotation mark", value: "“" },
    { label: "right double quotation mark", value: "”" },
    { label: "single low 9 quotation mark", value: "‚" },
    { label: "double low 9 quotation mark", value: "„" },
    { label: "less than sign", value: "<" },
    { label: "greater than sign", value: ">" },
    { label: "less than or equal to", value: "≤" },
    { label: "greater than or equal to", value: "≥" },
    { label: "en dash", value: "–" },
    { label: "em dash", value: "—" },
    { label: "macron", value: "¯" },
    { label: "overline", value: "‾" },
    { label: "currency sign", value: "¤" },
    { label: "broken bar", value: "¦" },
    { label: "diaeresis", value: "¨" },
    { label: "inverted exclamation mark", value: "¡" },
    { label: "turned question mark", value: "¿" },
    { label: "circumflex accent", value: "ˆ" },
    { label: "small tilde", value: "˜" },
    { label: "degree sign", value: "°" },
    { label: "minus sign", value: "−" },
    { label: "plus minus sign", value: "±" },
    { label: "division sign", value: "÷" },
    { label: "fraction slash", value: "⁄" },
    { label: "multiplication sign", value: "×" },
    { label: "superscript one", value: "¹" },
    { label: "superscript two", value: "²" },
    { label: "superscript three", value: "³" },
    { label: "fraction one quarter", value: "¼" },
    { label: "fraction one half", value: "½" },
    { label: "fraction three quarters", value: "¾" },
  ],
  mathematical: [
    { label: "function / florin", value: "ƒ" },
    { label: "integral", value: "∫" },
    { label: "n ary sumation", value: "∑" },
    { label: "infinity", value: "∞" },
    { label: "square root", value: "√" },
    { label: "similar to", value: "∼" },
    { label: "approximately equal to", value: "≅" },
    { label: "almost equal to", value: "≈" },
    { label: "not equal to", value: "≠" },
    { label: "identical to", value: "≡" },
    { label: "element of", value: "∈" },
    { label: "not an element of", value: "∉" },
    { label: "contains as member", value: "∋" },
    { label: "n ary product", value: "∏" },
    { label: "logical and", value: "∧" },
    { label: "logical or", value: "∨" },
    { label: "not sign", value: "¬" },
    { label: "intersection", value: "∩" },
    { label: "union", value: "∪" },
    { label: "partial differential", value: "∂" },
    { label: "for all", value: "∀" },
    { label: "there exists", value: "∃" },
    { label: "diameter", value: "∅" },
    { label: "backward difference", value: "∇" },
    { label: "asterisk operator", value: "∗" },
    { label: "proportional to", value: "∝" },
    { label: "angle", value: "∠" },
  ],
  extendedLatin: [
    { label: "A grave", value: "À" },
    { label: "A acute", value: "Á" },
    { label: "A circumflex", value: "Â" },
    { label: "A tilde", value: "Ã" },
    { label: "A diaeresis", value: "Ä" },
    { label: "A ring above", value: "Å" },
    { label: "A macron", value: "Ā" },
    { label: "ligature AE", value: "Æ" },
    { label: "C cedilla", value: "Ç" },
    { label: "E grave", value: "È" },
    { label: "E acute", value: "É" },
    { label: "E circumflex", value: "Ê" },
    { label: "E diaeresis", value: "Ë" },
    { label: "E macron", value: "Ē" },
    { label: "I grave", value: "Ì" },
    { label: "I acute", value: "Í" },
    { label: "I circumflex", value: "Î" },
    { label: "I diaeresis", value: "Ï" },
    { label: "I macron", value: "Ī" },
    { label: "ETH", value: "Ð" },
    { label: "N tilde", value: "Ñ" },
    { label: "O grave", value: "Ò" },
    { label: "O acute", value: "Ó" },
    { label: "O circumflex", value: "Ô" },
    { label: "O tilde", value: "Õ" },
    { label: "O diaeresis", value: "Ö" },
    { label: "O slash", value: "Ø" },
    { label: "O macron", value: "Ō" },
    { label: "ligature OE", value: "Œ" },
    { label: "S caron", value: "Š" },
    { label: "U grave", value: "Ù" },
    { label: "U acute", value: "Ú" },
    { label: "U circumflex", value: "Û" },
    { label: "U diaeresis", value: "Ü" },
    { label: "U macron", value: "Ū" },
    { label: "Y acute", value: "Ý" },
    { label: "Y diaeresis", value: "Ÿ" },
    { label: "Y macron", value: "Ȳ" },
    { label: "THORN", value: "Þ" },
    { label: "a grave", value: "à" },
    { label: "a acute", value: "á" },
    { label: "a circumflex", value: "â" },
    { label: "a tilde", value: "ã" },
    { label: "a diaeresis", value: "ä" },
    { label: "a ring above", value: "å" },
    { label: "a macron", value: "ā" },
    { label: "ligature ae", value: "æ" },
    { label: "c cedilla", value: "ç" },
  ],
  symbols: [
    { label: "alef symbol", value: "ℵ" },
    { label: "pi symbol", value: "ϖ" },
    { label: "real part symbol", value: "ℜ" },
    { label: "upsilon hook symbol", value: "ϒ" },
    { label: "Weierstrass p", value: "℘" },
    { label: "imaginary part", value: "ℑ" },
  ],
  arrows: [
    { label: "leftwards arrow", value: "←" },
    { label: "upwards arrow", value: "↑" },
    { label: "rightwards arrow", value: "→" },
    { label: "downwards arrow", value: "↓" },
    { label: "left right arrow", value: "↔" },
    { label: "carriage return", value: "↵" },
    { label: "leftwards double arrow", value: "⇐" },
    { label: "upwards double arrow", value: "⇑" },
    { label: "rightwards double arrow", value: "⇒" },
    { label: "downwards double arrow", value: "⇓" },
    { label: "left right double arrow", value: "⇔" },
    { label: "therefore", value: "∴" },
    { label: "subset of", value: "⊂" },
    { label: "superset of", value: "⊃" },
    { label: "not a subset of", value: "⊄" },
    { label: "subset of or equal to", value: "⊆" },
    { label: "superset of or equal to", value: "⊇" },
    { label: "circled plus", value: "⊕" },
    { label: "circled times", value: "⊗" },
    { label: "perpendicular", value: "⊥" },
    { label: "dot operator", value: "⋅" },
    { label: "left ceiling", value: "⌈" },
    { label: "right ceiling", value: "⌉" },
    { label: "left floor", value: "⌊" },
    { label: "right floor", value: "⌋" },
    { label: "left pointing angle bracket", value: "〈" },
    { label: "right pointing angle bracket", value: "〉" },
    { label: "lozenge", value: "◊" },
    { label: "black spade suit", value: "♠" },
    { label: "black club suit", value: "♣" },
    { label: "black heart suit", value: "♥" },
    { label: "black diamond suit", value: "♦" },
    { label: "en space", value: " " },
    { label: "em space", value: " " },
    { label: "thin space", value: " " },
    { label: "zero width non joiner", value: "‌" },
    { label: "zero width joiner", value: "‍" },
    { label: "left to right mark", value: "‎" },
    { label: "right to left mark", value: "‏" },
  ],
};

const selectCategory = (category: CharacterCategories) =>
  (selectedCategory.value = category);

const filteredCharacters = computed(() => {
  const category = selectedCategory.value || "currency";
  return characters[category].filter(
    (c: Character) =>
      c.label.includes(search.value) || c.value.includes(search.value),
  );
});

const insertCharacter = (character: string) => {
  props.editor.commands.insertContent(character);
};
</script>

<style lang="scss" scoped>
* {
  font-family: "yekan", sans-serif;
}
.chars-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 20rem;
  overflow-y: auto;
}
.char-btn {
  display: flex;
  font-size: 1.25rem;
  margin: 0.5rem;
}
.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.75rem;
}
.button {
  padding: 1rem;
}
</style>
