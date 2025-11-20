import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked, ShieldCheck, Truck, Library, Users } from "lucide-react";

const featureCards = [
	{
		icon: BookMarked,
		title: "Curated Catalog",
		description:
			"Handpicked titles from acclaimed authors and indie voices.",
	},
	{
		icon: ShieldCheck,
		title: "Verified Sellers",
		description: "Every seller is vetted to guarantee authentic inventory.",
	},
	{
		icon: Truck,
		title: "Express Delivery",
		description: "Fast, trackable shipping from warehouses near you.",
	},
];

const Landing = () => {
	return (
		<div className="min-h-screen px-4 bg-linear-to-b from-primary/30 to-muted/30">
			<section className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
				<div className="space-y-8">
					<Badge className="w-fit rounded-full bg-primary/15 text-primary">
						New season • Fresh reads
					</Badge>
					<div className="space-y-6">
						<h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
							The marketplace for modern book lovers.
						</h1>
						<p className="text-lg text-muted-foreground">
							Discover award-winning releases, timeless classics,
							and indie gems— all curated with premium service and
							fast delivery. Join thousands of readers sourcing
							their next favorite story on BookMart.
						</p>
					</div>
					<div className="flex flex-wrap gap-4">
						<Button size="lg" className="px-8" asChild>
							<Link to="/books">Browse the catalog</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="px-8"
							asChild
						>
							<Link to="/register">Open a seller account</Link>
						</Button>
					</div>
					<div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Library className="size-4 text-primary" />
							<span>Curated lists posted weekly</span>
						</div>
						<div className="flex items-center gap-2">
							<Users className="size-4 text-primary" />
							<span>Community-backed reviews</span>
						</div>
					</div>
				</div>
				<Card className="bg-gradient-to-br from-card to-card/70 shadow-2xl">
					<CardHeader>
						<CardTitle className="text-2xl">
							This Week&apos;s Collection
						</CardTitle>
						<CardDescription>
							Signed editions, debut authors, and rare hardcovers
							curated by our editorial team.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-4">
							{[
								"Literary Fiction",
								"Speculative Worlds",
								"Thought Leadership",
							].map((collection) => (
								<div
									key={collection}
									className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3"
								>
									<div>
										<p className="text-sm text-muted-foreground">
											Collection
										</p>
										<p className="text-base font-semibold">
											{collection}
										</p>
									</div>
									<Button variant="ghost" size="sm" asChild>
										<Link to="/books">Explore</Link>
									</Button>
								</div>
							))}
						</div>
						<div className="rounded-2xl border border-border/60 bg-primary/5 p-4">
							<p className="text-sm font-medium text-primary">
								Editor&apos;s pick
							</p>
							<p className="mt-2 text-lg font-semibold">
								Signed, limited-run copies of this year&apos;s
								Booker nominees are now in stock.
							</p>
						</div>
					</CardContent>
				</Card>
			</section>

			<section className="container grid gap-6 py-12 md:grid-cols-3">
				{featureCards.map((feature) => {
					const Icon = feature.icon;
					return (
						<Card key={feature.title}>
							<CardHeader className="flex flex-row items-center gap-4 space-y-0">
								<span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
									<Icon className="size-5" />
								</span>
								<div>
									<CardTitle className="text-lg">
										{feature.title}
									</CardTitle>
									<CardDescription>
										{feature.description}
									</CardDescription>
								</div>
							</CardHeader>
						</Card>
					);
				})}
			</section>

			<section className="container py-16">
				<Card className="bg-primary text-primary-foreground">
					<CardHeader className="space-y-4 text-center">
						<Badge
							variant="secondary"
							className="mx-auto bg-white/20 text-white"
						>
							Early access
						</Badge>
						<CardTitle className="text-3xl">
							Launch your next chapter
						</CardTitle>
						<CardDescription className="text-base text-primary-foreground/80">
							Whether you&apos;re here to read or to sell,
							BookMart gives you the modern tools to build a
							vibrant bookshelf.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap items-center justify-center gap-4">
						<Button size="lg" variant="secondary" asChild>
							<Link to="/register">Create a free account</Link>
						</Button>
						<Button
							size="lg"
							variant="ghost"
							className="text-primary-foreground"
							asChild
						>
							<Link to="/books">Preview the catalog</Link>
						</Button>
					</CardContent>
				</Card>
			</section>
		</div>
	);
};

export default Landing;
