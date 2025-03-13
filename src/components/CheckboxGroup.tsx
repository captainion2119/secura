export default function CheckboxGroup({ title, options }: { title: string; options: string[] }) {
    return (
      <div className="border rounded-lg p-4 w-56">
        <select className="mb-2 w-full border border-gray-300 rounded-md py-1 px-2">
          <option>{title}</option>
        </select>
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <label>{option}</label>
          </div>
        ))}
      </div>
    );
  }
  