namespace socialnetwork.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 3;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (MaxPageSize < value) ? MaxPageSize : value; }
        }

        public int UserId { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge {get;set;} = 99;

        public string OrderBy {get;set;}

        public bool Likers {get;set;}= false;
        public bool Likees {get;set;} = false;
        
    }
}