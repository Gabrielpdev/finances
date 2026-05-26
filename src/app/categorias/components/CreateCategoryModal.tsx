"use client";
import { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createCategories } from "@/app/actions/categories/create";
import { TransactionsContext } from "@/providers/transactions";
import PiIcons from "@/components/elements/icons";
import { ICategory } from "@/types/data";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  "PiShoppingCart",
  "PiHouse",
  "PiCar",
  "PiHeart",
  "PiGameController",
  "PiBook",
  "PiSuitcaseSimple",
  "PiPlant",
  "PiDog",
  "PiMusicNote",
  "PiFilmSlate",
  "PiAirplane",
];

export function CreateCategoryModal({
  isOpen,
  onClose,
}: CreateCategoryModalProps) {
  const { refreshCategories } = useContext(TransactionsContext);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      alert("Por favor, digite um nome para a categoria");
      return;
    }

    setLoading(true);
    try {
      const newCategory: ICategory = {
        name: categoryName,
        icon: selectedIcon,
        color: selectedColor,
        list: [],
        goal: 0,
        id: "",
      };

      await createCategories(newCategory);
      await refreshCategories();

      setCategoryName("");
      setSelectedIcon(AVAILABLE_ICONS[0]);
      setSelectedColor("#FFFFFF");
      onClose();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova categoria
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Nome da Categoria */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Nome da Categoria
            </label>
            <input
              id="category-name"
              type="text"
              placeholder="Ex: Alimentação"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Cor da Categoria */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category-color" className="text-sm font-medium">
              Cor da Categoria
            </label>
            <div className="flex items-center gap-3">
              <input
                id="category-color"
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded-md border border-gray-300"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">{selectedColor}</span>
            </div>
          </div>

          {/* Ícone da Categoria */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ícone da Categoria</label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex h-10 items-center justify-center rounded-md border-2 transition-all ${
                    selectedIcon === icon
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={loading}
                  title={icon}
                >
                  <PiIcons iconName={icon} />
                </button>
              ))}
            </div>
          </div>

          {/* Prévia da Categoria */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Prévia</label>
            <div
              className="flex items-center justify-center rounded-md p-4 text-2xl text-blue-950"
              style={{ backgroundColor: selectedColor }}
            >
              <PiIcons iconName={selectedIcon} />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateCategory}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Criando..." : "Criar Categoria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
