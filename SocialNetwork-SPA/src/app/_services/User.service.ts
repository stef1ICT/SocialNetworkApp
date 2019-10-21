import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/_models/user';
import { PaginationResult } from 'src/_models/Pagination';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }


getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginationResult<User[]>> {
   const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
  let params = new HttpParams(); 

   if(page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }
   if(userParams != null) {
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('minAge', userParams.minAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
  }

   if (likeParams === 'likers') {
    params = params.append('Likers', 'true');
  }
   if (likeParams === 'likees') {
    params = params.append('Likees', 'true');
  }
   return this.http.get<User[]>(this.baseUrl + 'users', {observe : 'response', params}).pipe( map(response => {
        paginationResult.result = response.body;

        if(response.headers.get('Pagination') != null) {
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginationResult;
  }));
}

getUser(id): Observable<User> {
      return this.http.get<User>(this.baseUrl + 'users/' + id);
}


updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user); 
}

setTheMainPhoto(userId: number, photoId: number) {
  return this.http.post(this.baseUrl + "users/" + userId + "/photos/" + photoId + "/setMain", {});
}

deletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

likeUser(id: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
}
}
