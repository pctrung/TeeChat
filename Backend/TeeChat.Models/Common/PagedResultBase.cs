﻿using System;

namespace TeeChat.Models.Common
{
    public class PagedResultBase
    {
        public int Page { get; set; }

        public int Limit { get; set; }

        public int TotalRecords { get; set; }

        public string Keyword { get; set; }

        public int PageCount
        {
            get
            {
                var pageCount = (double)TotalRecords / Limit;
                return (int)Math.Ceiling(pageCount);
            }
        }
    }
}