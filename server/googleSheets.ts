import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { ENV } from "./_core/env";

/**
 * Google Sheets API Integration Service
 * Handles synchronization of vehicle and occurrence data to Google Sheets
 */

let authClient: JWT | null = null;

/**
 * Initialize Google Sheets authentication
 */
function initializeAuth(): JWT {
  if (authClient) {
    return authClient;
  }

  try {
    const credentials = JSON.parse(ENV.googleSheetsCredentials || "{}");
    
    authClient = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return authClient;
  } catch (error) {
    console.error("[GoogleSheets] Error initializing auth:", error);
    throw new Error("Failed to initialize Google Sheets authentication");
  }
}

/**
 * Get Google Sheets API client
 */
function getSheetsClient() {
  const auth = initializeAuth();
  return google.sheets({ version: "v4", auth });
}

/**
 * Sync vehicle data to Google Sheets
 */
export async function syncVehicleToSheets(vehicleData: {
  date: string;
  horaInicial: string;
  viatura: string;
  condutor: string;
  apoio: string;
  kmInicial: number;
  kmFinal?: number;
  horaFinal?: string;
  kmPercorridos?: number;
  observacoes?: string;
}): Promise<boolean> {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = ENV.googleSheetsSpreadsheetId;

    if (!spreadsheetId) {
      console.error("[GoogleSheets] Spreadsheet ID not configured");
      return false;
    }

    const values = [[
      vehicleData.date,
      vehicleData.horaInicial,
      vehicleData.viatura,
      vehicleData.condutor,
      vehicleData.apoio,
      vehicleData.kmInicial,
      vehicleData.kmFinal || "",
      vehicleData.horaFinal || "",
      vehicleData.kmPercorridos || "",
      vehicleData.observacoes || "",
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: "VIATURAS!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    console.log(`[GoogleSheets] Successfully synced vehicle: ${vehicleData.viatura}`);
    return true;
  } catch (error) {
    console.error("[GoogleSheets] Error syncing vehicle:", error);
    return false;
  }
}

/**
 * Sync occurrence data to Google Sheets
 */
export async function syncOccurrenceToSheets(occurrenceData: {
  date: string;
  horaInicial: string;
  horaFinal?: string;
  viatura: string;
  condutor: string;
  apoio: string;
  local: string;
  codigo: string;
  observacao?: string;
  fotosVideos?: string;
}): Promise<boolean> {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = ENV.googleSheetsSpreadsheetId;

    if (!spreadsheetId) {
      console.error("[GoogleSheets] Spreadsheet ID not configured");
      return false;
    }

    const values = [[
      occurrenceData.date,
      occurrenceData.horaInicial,
      occurrenceData.horaFinal || "",
      occurrenceData.viatura,
      occurrenceData.condutor,
      occurrenceData.apoio,
      occurrenceData.local,
      occurrenceData.codigo,
      occurrenceData.observacao || "",
      occurrenceData.fotosVideos || "",
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: "OCORRÊNCIAS!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });

    console.log(`[GoogleSheets] Successfully synced occurrence at ${occurrenceData.local}`);
    return true;
  } catch (error) {
    console.error("[GoogleSheets] Error syncing occurrence:", error);
    return false;
  }
}

/**
 * Create sheet headers if they don't exist
 */
export async function ensureSheetHeaders(): Promise<boolean> {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = ENV.googleSheetsSpreadsheetId;

    if (!spreadsheetId) {
      console.error("[GoogleSheets] Spreadsheet ID not configured");
      return false;
    }

    // Check and create VIATURAS sheet headers
    const vehicleHeaders = [[
      "Data",
      "Hora Inicial",
      "Viatura",
      "Condutor",
      "Apoio",
      "KM Inicial",
      "KM Final",
      "Hora Final",
      "KM Percorridos",
      "Observações",
    ]];

    // Check and create OCORRÊNCIAS sheet headers
    const occurrenceHeaders = [[
      "Data",
      "Hora Inicial",
      "Hora Final",
      "Viatura",
      "Condutor",
      "Apoio",
      "Local",
      "Código",
      "Observação",
      "Fotos/Vídeos",
    ]];

    // Try to append headers (they will only be added if the sheet is empty)
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "VIATURAS!A1:J1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: vehicleHeaders,
        },
      });
    } catch (e) {
      // Sheet might already have headers, continue
    }

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "OCORRÊNCIAS!A1:J1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: occurrenceHeaders,
        },
      });
    } catch (e) {
      // Sheet might already have headers, continue
    }

    console.log("[GoogleSheets] Sheet headers ensured");
    return true;
  } catch (error) {
    console.error("[GoogleSheets] Error ensuring headers:", error);
    return false;
  }
}

/**
 * Test Google Sheets connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = ENV.googleSheetsSpreadsheetId;

    if (!spreadsheetId) {
      console.error("[GoogleSheets] Spreadsheet ID not configured");
      return false;
    }

    // Try to read the spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    console.log(`[GoogleSheets] Connection test successful. Spreadsheet: ${response.data.properties?.title}`);
    return true;
  } catch (error) {
    console.error("[GoogleSheets] Connection test failed:", error);
    return false;
  }
}
