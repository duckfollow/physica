import type { LevelId } from "@/content/curriculum";
export interface TutorMessage { role: "user" | "assistant"; content: string; }
export interface TutorRequest { level: LevelId; lessonId?: string; messages: TutorMessage[]; }
/** Implement with an external authenticated backend; never include provider secrets in the browser. */
export interface TutorProvider { reply(request: TutorRequest, signal?: AbortSignal): Promise<TutorMessage>; }
