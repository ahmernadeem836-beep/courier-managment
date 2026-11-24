import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

export interface ApiBranch {
  branch_id: number;
  branch_name: string;
  branch_code: string;
  address: string;
  city: string;
  phone: string;
  is_active: number | boolean;
}

export interface BranchPayload {
  branch_name: string;
  branch_code: string;
  address: string;
  city: string;
  phone: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  private http = inject(HttpClient);

  getBranches(): Observable<{
    count: number;
    branches: ApiBranch[];
  }> {
    return this.http.get<{
      count: number;
      branches: ApiBranch[];
    }>(`${API_URL}/branches`);
  }

  createBranch(data: BranchPayload): Observable<any> {
    return this.http.post(`${API_URL}/branches`, data);
  }

  updateBranch(
    branchId: number,
    data: Partial<BranchPayload>
  ): Observable<any> {
    return this.http.put(
      `${API_URL}/branches/${branchId}`,
      data
    );
  }

  deactivateBranch(branchId: number): Observable<any> {
    return this.http.patch(
      `${API_URL}/branches/${branchId}/deactivate`,
      {}
    );
  }
}