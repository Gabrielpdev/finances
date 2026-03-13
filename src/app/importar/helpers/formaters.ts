import { IData, IFormattedData } from "@/types/data";

export const removeDuplicates = (
  json: IData[],
  currentList: IFormattedData[],
) => {
  return json.filter((savedItem) => {
    return !currentList.some((newItem) => newItem.id === savedItem.id);
  });
};

export const removeSelectedItem = (
  json: IData[],
  selectedToDelete: string[],
) => {
  const filtered = json?.filter((item: any) => {
    const removed = selectedToDelete.some(
      (selected) => selected === item["Identificador"],
    );

    return !removed;
  });

  return filtered;
};

export const addTimeStamp = (json: IData[]) => {
  return json.map((item) => {
    const [day, month, year] = item.date.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00`);

    return {
      ...item,
      timestamp: date.getTime(),
    };
  });
};
