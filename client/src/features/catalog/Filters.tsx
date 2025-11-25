import {
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Filters as FiltersType } from "../../app/models/product";

interface FiltersProps {
  filters?: FiltersType;
  selectedBrands: string[];
  selectedTypes: string[];
  onBrandChange: (brand: string) => void;
  onTypeChange: (type: string) => void;
}

export default function Filters({
  filters,
  selectedBrands,
  selectedTypes,
  onBrandChange,
  onTypeChange,
}: FiltersProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Brands
      </Typography>
      <FormGroup>
        {filters?.brands.map((brand) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandChange(brand)}
              />
            }
            label={brand}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
        Types
      </Typography>
      <FormGroup>
        {filters?.types.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeChange(type)}
              />
            }
            label={type}
          />
        ))}
      </FormGroup>
    </Paper>
  );
}
