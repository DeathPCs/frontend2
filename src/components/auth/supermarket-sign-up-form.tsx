'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  supermarketName: zod.string()
    .min(1, { message: 'El nombre del supermercado es requerido' })
    .max(255, { message: 'El nombre del supermercado no debe tener más de 100 caracteres' }),
  location: zod.string()
    .min(1, { message: 'La ubicación es requerida' })
    .max(255, { message: 'La ubicación no debe tener más de 100 caracteres' }),
  address: zod.string()
    .min(1, { message: 'La dirección es requerida' })
    .max(255, { message: 'La dirección no debe tener más de 255 caracteres' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { supermarketName: '', location: '', address: ''} satisfies Values;

export function SupermarketSignUpForm(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<Values>({ 
    defaultValues, 
    resolver: zodResolver(schema),
    mode: 'onChange', 
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
        setIsPending(true);
  
        const { error } = await authClient.supermarketsignUp(values);
  
        if (error) {
          setError('root', { type: 'server', message: error });
          setIsPending(false);
          return;
        }
  
        await checkSession?.();
        router.refresh();
      },
      [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Registro de Supermercado</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="supermarketName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.supermarketName)}>
                <InputLabel>Nombre del supermercado</InputLabel>
                <OutlinedInput {...field} label="Supermarket Name" />
                {errors.supermarketName ? <FormHelperText>{errors.supermarketName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <FormControl error={Boolean(errors.location)}>
                <InputLabel>Ubicación</InputLabel>
                <OutlinedInput {...field} label="Location" />
                {errors.location ? <FormHelperText>{errors.location.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <FormControl error={Boolean(errors.address)}>
                <InputLabel>Dirección</InputLabel>
                <OutlinedInput {...field} label="Address" />
                {errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={!isValid || isPending} type="submit" variant="contained">
            Registrar Supermercado
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

// Example of fake API signup function (replace with actual API)
async function fakeSignUp(values: Values): Promise<{ error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ error: '' });
    }, 2000);
  });
}
function checkSession() {
    throw new Error('Function not implemented.');
}

