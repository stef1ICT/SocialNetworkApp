namespace socialnetwork.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int TotalPage {get;set;}
        public int ItemsPerPage {get;set;}
        public int TotalItems {get;set;}

        public PaginationHeader(int currentPage, int totalPage, int itemsPerPage, int totalItems)
        {
           this.CurrentPage = currentPage;
            this.TotalPage = totalPage;
            this.ItemsPerPage = itemsPerPage;
            this.TotalItems = totalItems;
            
        }
    }
}