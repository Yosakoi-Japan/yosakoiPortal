export type CsvRow = Record<string, string>;

export type CsvParseError = {
  message: string;
  row: number;
  column: number;
};

export type CsvParseResult = {
  rows: CsvRow[];
  errors: CsvParseError[];
};

const isEmptyRecord = (record: string[]) =>
  record.every((value) => value.trim().length === 0);

const normalizeHeader = (header: string, index: number) => {
  const trimmed = header.trim();
  return index === 0 ? trimmed.replace(/^\ufeff/, "") : trimmed;
};

export const parseCsvRows = (csvText: string): CsvParseResult => {
  const records: string[][] = [[]];
  const errors: CsvParseError[] = [];
  let current = "";
  let inQuotes = false;
  let row = 1;
  let column = 1;

  const pushField = () => {
    records[records.length - 1].push(current);
    current = "";
    column += 1;
  };

  const pushRecord = () => {
    pushField();
    records.push([]);
    row += 1;
    column = 1;
  };

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];

    if (inQuotes) {
      if (char === '"') {
        if (csvText[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      if (current.length === 0) {
        inQuotes = true;
      } else {
        current += char;
        errors.push({
          message: "Unexpected quote in unquoted field",
          row,
          column,
        });
      }
      continue;
    }

    if (char === ",") {
      pushField();
      continue;
    }

    if (char === "\r" || char === "\n") {
      pushRecord();
      if (char === "\r" && csvText[index + 1] === "\n") {
        index += 1;
      }
      continue;
    }

    current += char;
  }

  if (inQuotes) {
    errors.push({
      message: "Quoted field is not closed",
      row,
      column,
    });
  }

  pushField();

  const nonEmptyRecords = records.filter((record) => !isEmptyRecord(record));
  if (nonEmptyRecords.length === 0) {
    return { rows: [], errors };
  }

  const headers = nonEmptyRecords[0].map(normalizeHeader);
  const rows = nonEmptyRecords.slice(1).map((record) =>
    headers.reduce<CsvRow>((rowData, header, index) => {
      if (header) {
        rowData[header] = (record[index] ?? "").trim();
      }
      return rowData;
    }, {}),
  );

  return { rows, errors };
};
