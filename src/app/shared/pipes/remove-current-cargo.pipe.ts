import { Pipe, PipeTransform } from '@angular/core';
import { Cargo } from '../../modules/account/models/user.model';

@Pipe({
  name: 'removeCurrentCargo',
})
export class RemoveCurrentCargoPipe implements PipeTransform {
  transform(cargos: Cargo[] | undefined, currentCargoId?: number): Cargo[] {
    if (!cargos) return []; // Retorna um array vazio se cargos for undefined
    if (!currentCargoId) return cargos;
    return cargos.filter((cargo) => cargo.cargo_id !== currentCargoId);
  }
}
