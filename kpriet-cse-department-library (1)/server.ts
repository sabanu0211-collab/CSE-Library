import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  generateCurriculumLibrarianResponse,
  KPRIET_CSE_CURRICULUM,
  KPRIET_LIBRARY_RULES,
} from "./src/services/curriculumEngine";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      institution: "KPR Institute of Engineering and Technology",
      department: "Computer Science and Engineering",
      system: "Library Book Availability & Issue System",
      timestamp: new Date().toISOString(),
    });
  });

  // AI Assistant for CSE Syllabus & Book Guidance
  app.post("/api/gemini/assist", async (req, res) => {
    const { prompt, currentBooks } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const booksList = Array.isArray(currentBooks) ? currentBooks : [];

    const totalAvailable = booksList.reduce(
      (acc: number, b: any) => acc + (b.availableCopies || 0),
      0
    );

    const bookCatalogSummary = booksList
      .map(
        (b: any) =>
          `• [${b.accessionNo || b.id}] "${b.title}" by ${b.author} | Subj: ${
            b.subjectCode || "CSE"
          } (${b.category}) | Sem: ${b.semester} | Rack: ${
            b.rackLocation
          } (Rack ID: ${b.rackId}) | Status: ${
            b.availableCopies > 0
              ? `AVAILABLE (${b.availableCopies}/${b.totalCopies} on shelf)`
              : `CHECKED OUT (0/${b.totalCopies} on shelf)`
          }`
      )
      .join("\n");

    const curriculumSummary = KPRIET_CSE_CURRICULUM.map(
      (c) =>
        `- ${c.code} (${c.name}, Sem ${c.semester}): Textbook "${c.primaryTextbook}" by ${c.authors}. Rack: ${c.rackLocation}. GATE Relevance: ${c.gateRelevance}`
    ).join("\n");

    const systemInstruction = `You are the expert AI Academic Librarian & Curriculum Advisor for the Department of Computer Science and Engineering (CSE) Library at KPR Institute of Engineering and Technology (KPRIET), Coimbatore, Tamil Nadu.

Institution & Department Library Details:
• Institution: KPR Institute of Engineering and Technology (KPRIET), Coimbatore (Autonomous, NAAC A+ accredited, affiliated with Anna University).
• Department: Department of Computer Science and Engineering (CSE).
• Library Location: ${KPRIET_LIBRARY_RULES.location}
• Operating Hours: ${KPRIET_LIBRARY_RULES.hours}
• Borrowing Rules:
  - UG (B.E. CSE): ${KPRIET_LIBRARY_RULES.borrowingLimits.ug}
  - PG (M.E. CSE / Ph.D): ${KPRIET_LIBRARY_RULES.borrowingLimits.pg}
  - Faculty: ${KPRIET_LIBRARY_RULES.borrowingLimits.faculty}
  - Renewals: ${KPRIET_LIBRARY_RULES.renewals}
  - Overdue Fines: ${KPRIET_LIBRARY_RULES.fines}
  - Reservations: ${KPRIET_LIBRARY_RULES.reservation}

Department Physical Racks:
• Rack CSE-01: Data Structures & Algorithms, Programming in C/Java, Computer Architecture
• Rack CSE-02: Operating Systems (Silberschatz, Tanenbaum), DBMS (Korth, Navathe, Ramakrishnan)
• Rack CSE-03: Computer Networks (Kurose & Ross, Tanenbaum), Cryptography & Network Security (Stallings)
• Rack CSE-04: Artificial Intelligence (Russell & Norvig), Machine Learning, Deep Learning (Goodfellow)
• Rack CSE-05: Theory of Computation (Hopcroft, Linz), Compiler Design (Dragon Book - Aho & Ullman)
• Rack CSE-06: Cloud Computing (Thomas Erl), Distributed Systems, IoT (Arshdeep Bahga)
• Rack CSE-07: Discrete Mathematics (Kenneth Rosen), Probability & Statistics, Graph Theory
• Rack CSE-08: Software Engineering (Pressman, Sommerville), Web Development, Capstone Project Archives

Official KPRIET CSE Curriculum & Prescribed Textbooks:
${curriculumSummary}

Real-Time Live Catalog in CSE Library (${booksList.length} titles, ${totalAvailable} available copies):
${bookCatalogSummary || "Standard KPRIET CSE Department catalog available."}

Guidelines:
1. Provide accurate, clear, and encouraging academic guidance for any student or faculty question.
2. If asked about book availability or shelf location, mention the exact Rack number, Shelf, subject code, and live availability on shelf.
3. If a book has 0 copies, advise using the Reserve button to place a hold.
4. Format using clean Markdown with bold titles, clean bullet points, and neat structure.`;

    try {
      const ai = getGeminiClient();
      if (ai) {
        const aiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        if (aiResponse && aiResponse.text) {
          return res.json({
            response: aiResponse.text,
            simulated: false,
          });
        }
      }
    } catch (error: any) {
      console.warn("Gemini API call warning, utilizing Academic Knowledge Engine fallback:", error?.message);
    }

    // High-precision built-in curriculum answering engine fallback
    const offlineCurriculumResponse = generateCurriculumLibrarianResponse(
      prompt,
      booksList
    );

    return res.json({
      response: offlineCurriculumResponse,
      simulated: true,
    });
  });

  // Vite middleware setup for Development and Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KPRIET CSE Library Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
