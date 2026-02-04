import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "book.fill")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("ChuraTutor")
                .font(.largeTitle)
                .fontWeight(.bold)
            Text("Welcome to ChuraTutor")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
