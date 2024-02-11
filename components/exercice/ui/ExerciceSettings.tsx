"use client";

import { useContext } from "react";
import ExerciceStateContext from "../context/ExerciceStateContext";
import useSettings from "../hooks/useSettings";
import { Settings, isValidSettings, nbQuestionsValues } from "@/utils/settings";
import { categories as allCategories } from "@/data/fra-dpt";
import SelectField from "./form/SelectField";
import CheckboxFields from "./form/CheckboxFields";
import CategoryCheckboxLabel from "./form/CategoryCheckboxLabel";
import { filterCategories, hasCategory } from "@/utils/settings-category";

export default function ExerciceSettings() {
  const [_, dispatch] = useContext(ExerciceStateContext);
  const [settings, updateSettings] = useSettings();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newSettrings: Settings = {
      nbQuestions: Number(formData.get("nbQuestions")),
      categories: filterCategories(
        allCategories,
        formData.getAll("categories")
      ),
    };

    if (isValidSettings(newSettrings)) {
      updateSettings(newSettrings);
      dispatch("RELOAD_STATE");
    }
  }

  return (
    settings && (
      <div className="w-full max-w-screen-md">
        <h3 className="font-bold text-2xl">Settings</h3>
        <form onSubmit={handleSubmit}>
          <SelectField
            id="nbQuestions"
            name="nbQuestions"
            label="Number of questions"
            defaultValue={settings.nbQuestions}
            options={nbQuestionsValues.map((v) => ({
              label: v.toString(),
              value: v,
            }))}
          />
          <CheckboxFields
            id="category"
            name="categories"
            checkboxes={allCategories.map((category, idx) => ({
              label: <CategoryCheckboxLabel category={category} />,
              value: idx,
              defaultChecked: hasCategory(settings.categories, category),
            }))}
          />
          <button
            type="submit"
            className="py-1 px-2 border-2 border-foreground"
          >
            Refresh ⟳
          </button>
        </form>
      </div>
    )
  );
}
