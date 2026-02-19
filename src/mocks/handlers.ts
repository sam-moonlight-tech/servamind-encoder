import { http, HttpResponse } from "msw";
import { env } from "@/config/env";
import {
  mockProcessingReceipts,
  mockFileReceipt,
  mockCompressionState,
  mockCompressionStatus,
  mockSystemStats,
} from "./fixtures";

const baseUrl = env.apiBaseUrl;

export const handlers = [
  http.post(`${baseUrl}/loginUser`, () => {
    return HttpResponse.json(mockProcessingReceipts);
  }),

  http.post(`${baseUrl}/uploadFile`, () => {
    return HttpResponse.json(mockFileReceipt);
  }),

  http.post(`${baseUrl}/compressionState`, () => {
    return HttpResponse.json(mockCompressionState);
  }),

  http.post(`${baseUrl}/compressionStatus`, () => {
    return HttpResponse.json(mockCompressionStatus);
  }),

  http.post(`${baseUrl}/startCompression`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${baseUrl}/cancelCompression`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${baseUrl}/pauseCompression`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${baseUrl}/resumeCompression`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${baseUrl}/systemStats`, () => {
    return HttpResponse.json(mockSystemStats);
  }),
];
