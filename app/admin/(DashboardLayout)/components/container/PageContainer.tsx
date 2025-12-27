type Props = {
  description?: string;
  children: any | any[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <div className="overflow-x-hidden max-w-screen pb-32">
    <title>{title}</title>
    <meta name="description" content={description} />
    {children}
  </div>
);

export default PageContainer;