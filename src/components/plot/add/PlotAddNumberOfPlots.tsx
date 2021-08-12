import React from 'react';
import { Trans } from '@lingui/macro';
import {
  AdvancedOptions,
  CardStep,
  Select,
  TextField,
  RadioGroup,
  Flex,
  Checkbox,
  TooltipIcon,
} from '@chia/core';
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
  Typography,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

const plotCountOptions: number[] = [];

for (let i = 1; i < 30; i += 1) {
  plotCountOptions.push(i);
}

export default function PlotAddNumberOfPlots() {
  const { watch } = useFormContext();
  const parallel = watch('parallel');

  return (
    <CardStep step="2" title={<Trans>Choose Number of Plots</Trans>}>
      <Grid spacing={2} direction="column" container>
        <Grid xs={12} md={8} lg={6} item>
          <FormControl variant="filled" fullWidth>
            <InputLabel required>
              <Trans>Plot Count</Trans>
            </InputLabel>
            <Select name="plotCount">
              {plotCountOptions.map((count) => (
                <MenuItem value={count} key={count}>
                  {count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12} md={8} lg={6} item>
          <Typography>
            <Trans>Does your machine support parallel plotting?</Trans>
          </Typography>
          <Typography color="textSecondary">
            <Trans>
              Plotting in parallel can save time. Otherwise, add plot(s) to the
              queue.
            </Trans>
          </Typography>

          <FormControl variant="filled" fullWidth>
            <RadioGroup name="parallel" boolean>
              <Flex gap={2} flexWrap="wrap">
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={<Trans>Add Plot to Queue</Trans>}
                />
                <FormControlLabel
                  control={<Radio />}
                  label={<Trans>Plot in Parallel</Trans>}
                  value
                />
              </Flex>
            </RadioGroup>
          </FormControl>
        </Grid>

        {parallel && (
          <Grid xs={12} md={8} lg={6} item>
            <FormControl variant="filled">
              <Typography variant="subtitle1">
                <Trans>Want to have a delay before the next plot starts?</Trans>
              </Typography>
              <TextField
                name="delay"
                type="number"
                variant="filled"
                label={<Trans>Delay</Trans>}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Trans>Minutes</Trans>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>

    </CardStep>
  );
}
