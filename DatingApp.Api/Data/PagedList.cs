using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; }
        public int TotalPages { get; }
        public int PageSize { get; }
        public int TotalCount { get; }

        private PagedList(List<T> items, int currentPage, int pageSize, int totalCount)
        {
            TotalCount = totalCount;
            PageSize = pageSize;
            CurrentPage = currentPage;
            TotalPages = (int) Math.Ceiling(totalCount/ (double) pageSize);
            AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> items, int pageNumber, int pageSize)
        {
            var totalCount = await items.CountAsync();

            var list = await items.Skip((pageNumber - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync();


            
            return new PagedList<T>(list, pageNumber, pageSize, totalCount);
        }
    }
}
