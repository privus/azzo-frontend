import { Pipe, PipeTransform } from '@angular/core';
import { Cargo } from 'src/app/modules/account/models/user.model';

@Pipe({
    name: 'removeCurrentCargo'
  })
  export class RemoveCurrentCargoPipe implements PipeTransform {
    transform(cargos: Cargo[], currentCargoId?: number): Cargo[] {
      if (!currentCargoId) return cargos;
      return cargos.filter(cargo => cargo.cargo_id !== currentCargoId);
    }
  }
  
