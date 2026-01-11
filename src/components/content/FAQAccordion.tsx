"use client";

import { useState } from "react";
import { faqItems } from "@/lib/site-data";

export default function FAQAccordion() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqItems[0]?.question || null);

  return (
    <div className="space-y-3">
      {faqItems.map((item) => {
        const isOpen = openQuestion === item.question;

        return (
          <article className="rounded-lg border border-gray-200" key={item.question}>
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
              onClick={() => setOpenQuestion(isOpen ? null : item.question)}
            >
              {item.question}
              <span>{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? <p className="px-4 pb-4 text-sm text-gray-600">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
