import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor(private router: Router) {}

  updateDisplayedItems(currentPage: number, itemsPerPage: number, filteredCustomersLength: number): { startItem: number; endItem: number } {
    const startItem = filteredCustomersLength === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredCustomersLength);
    return { startItem, endItem };
  }

  getPaginatedItems<T>(items: T[], currentPage: number, itemsPerPage: number): T[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }

  navigateToPage(currentPage: number, totalPages: number, action: 'previous' | 'next' | 'first' | 'last' | number): number {
    switch (action) {
      case 'previous':
        return Math.max(1, currentPage - 1);
      case 'next':
        return Math.min(totalPages, currentPage + 1);
      case 'first':
        return 1;
      case 'last':
        return totalPages;
      default:
        return action >= 1 && action <= totalPages ? action : currentPage;
    }
  }
}
